import { observer, setViewCenter, messageCenter } from '../module/init_module';
import UTILS from '../config/utils';
import CMDS from '../config/cmd';
import LapaUIView from './lapa/lapa';
import HeaderUIView from './header';
import BottomUIView from './bottom';
import JackpotUIView from './jackpot';
import { RoomMatch, MatchCloseUIView, MatchOpenUIView } from './com/roomMatch';
import CommonGameModule from '../module/com/commonGameModule';
import AudioMudule from '../module/com/audio';
import GoodJobUIView from './com/goodJob';
import GainNoticeUIView from './com/gainNotice';


// 房间
export default class RoomScene extends roomUI {
    constructor(messageCenter) {
        super();

        this.sceneName = 'roomScene';
        this.init(messageCenter);
        RoomScene.instance = this;
    }

    static getInstance(messageCenter) {
        return this.instance || new this(messageCenter);
    }

    init(messageCenter) {

        // 声音模块
        AudioMudule.getInstance().initResource();

        // 初始化房间内各个模块的ui
        this.initDom();

        // 配置数据
        this.MIN_TIME = 3 * 1000; // 最短时间
        this.MAX_TIME = 10 * 1000; // 最长时间
        this.result_data = null; // 结果数据
        this.loadingTime = 0; // 等待时间
        this.backlogList = []; // 待办事项
        this.isGameing = false; //是否游戏中

        // 注册
        messageCenter && this.registerAction(messageCenter);

        //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
        observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
    }

    onEnter() {
        // 视图居中
        setViewCenter();

        UTILS.log(this.sceneName + " enter");

        // 触发命令
        this.dispatchAction();

        //取消订阅时不用传递回调函数
        observer.unsubscribe(this.sceneName + "_enter");
    }

    // 注册
    registerAction(messageCenter) {
        messageCenter.registerAction(CMDS.SOCKET__INIT__GAME, this.initGameHandler.bind(this));
        messageCenter.registerAction(CMDS.SOCKET__BET, this.resultCome.bind(this));
        messageCenter.registerAction(CMDS.SOCKET__ALL__MATCH, this.allMatchHandler.bind(this));

        messageCenter.registerAction("recover", (data) => {
            observer.publish("matchResult", data);
        })

        // 跑马灯
        messageCenter.registerAction("marquee", (data) => {
            observer.publish("msg::marquee", data);
        })

        // 当前比赛排名数据(循环请求)
        messageCenter.registerAction(CMDS.SOCKET__MATCH__RANK, (data) => {
            MatchOpenUIView.getInstance().matchRankHandler(data);
            RoomMatch.getInstance().renderAmount(data.amount);
        });

        // 上期比赛排名数据
        messageCenter.registerAction(CMDS.SOCKET__LAST__MATCH, (data) => {
            MatchOpenUIView.getInstance().lastMatchHandler(data);

            observer.publish("lastMatch", data);
        });

        // 用户余额
        messageCenter.registerAction("userAccount", (data) => {
            HeaderUIView.getInstance().renderUserAccount(data);
        });

        // 比赛结束
        messageCenter.registerAction("matchResult", (data) => {
            RoomMatch.getInstance().matchResultHandler(data);
            observer.publish("matchResult", data);
        });

        // 比赛开始
        messageCenter.registerAction("matchStart", (data) => {
            // 比赛提示
            this.addBacklogList(() => {
                if (!RoomMatch.getInstance().isInMatch) {
                    observer.publish('pop::match::start');
                    RoomMatch.getInstance().updateDataInfo(data.info);
                }
            });
        });

        // 比赛预告及比赛计时信息
        messageCenter.registerAction("matchInfo", (data) => {
            RoomMatch.getInstance().updateDataInfo(data.info);
        });

        messageCenter.registerAction("help", (data) => {
            observer.publish("cmd::help", data);
        });

        CommonGameModule.getInstance().registerAction(messageCenter, observer);

        observer.subscribe('game::start', this.gameStart.bind(this));
        observer.subscribe('game::stop', this.gameStop.bind(this));
        observer.subscribe('game::reset', this.reset.bind(this));

    }

    // 取消注册
    unRegisterAction() {

    }

    // 触发
    dispatchAction() {
        // 初始化游戏
        messageCenter.emit(CMDS.SOCKET__INIT__GAME);
        messageCenter.emit("matchInfo");
        messageCenter.emit("recover");
    }

    // 初始化dom
    initDom() {
        // 头部
        this.top_box.addChild(HeaderUIView.getInstance());

        // 游戏区域
        this.game_box.addChild(LapaUIView.getInstance());

        // 大赛详情
        this.match_box.addChild(RoomMatch.getInstance());

        // 底部
        this.bottom_box.addChild(BottomUIView.getInstance());

        // 跑马灯
        this.marquee_box.parent.visible = false;
        CommonGameModule.getInstance().initMarquee(this.marquee_box);
    }

    // 游戏初始化
    initGameHandler(data) {
        // 奖池数据
        this.allMatchHandler(data);

        RoomMatch.getInstance().renderAmount(data.match);

        // 必须等到初始化游戏拿到数据后再去更新用户默认投币额
        // 是否登录
        if (UTILS.checkLoginStatus()) {
            // 用户余额
            messageCenter.emitAjax('userAccount');
        } else {
            observer.publish('bet::inputamount');
        }
    }

    // 开始游戏
    gameStart() {
        this.isGameing = true;
        this.reset();

        Laya.timer.loop(1 * 1000, this, this.addLoadingTimeHandler);
    }

    // 向待办事项列表添加事项
    addBacklogList(fn) {
        // 如果在游戏进行中
        if (this.isGameing) {
            this.backlogList.push(fn);
        } else {
            fn();
        }
    }

    // 当局结束
    gameStop() {
        this.isGameing = false;

        // 有待办事项
        if (this.backlogList.length) {
            this.backlogList.forEach((item, index) => item());
            this.backlogList.length = 0;
        }
    }

    addLoadingTimeHandler() {
        this.loadingTime++;

        this.betHandler();
    }

    // 结果过来了
    resultCome(data) {
        // 错误处理
        if (CommonGameModule.getInstance().errorHandler(data)) {
            observer.publish('game::reset');

            return;
        };

        this.result_data = data;
        // 投币成功
        observer.publish('bet::success');
        this.betHandler();
    }

    // 投币结果
    betHandler() {
        // 时间过久
        if (this.loadingTime > 10) {
            let text = '网络断开，稍候后重试。';
            observer.publish('common::tips', text);
            observer.publish('game::reset');

            return;
        }

        // 时间上满足  && 数据上满足
        if (this.result_data && this.loadingTime >= 3) {
            // 中奖 且 单线有5个相连图片 
            this.result_data.lines.forEach((item, index) => {
                let arr = [];
                if (Number(item.num) === 5) {
                    arr.push(item.num);
                }
                if (arr.length) {
                    this.addBacklogList(() => { GoodJobUIView.getInstance().enter(arr) });
                }
            })

            let data = this.result_data;
            this.reset();

            // 补充一下空位(0位置需要一个空数据)
            data.pic.forEach((item, index) => {
                item.unshift(null);
            })

            LapaUIView.getInstance().stop(data);
        }

    }

    // 处理奖池数据
    allMatchHandler(data) {

        JackpotUIView.getInstance().renderInfo(data);
    }

    // 异步优化
    myPromise(context, delay) {
        return new Promise((resolve, reject) => {
            Laya.timer.once(delay, context, resolve);
        })
    }

    onExit() {
        UTILS.log(this.sceneName + " exit");

        // 取消所有注册
        this.unRegisterAction();

        //发布退出事件
        observer.publish(this.sceneName + "_exit");

        this.clear();
    }

    reset() {
        this.result_data = null;
        this.loadingTime = 0;
        Laya.timer.clear(this, this.addLoadingTimeHandler);

    }

    //自定义方法，场景退出的时候是销毁还是removeSelf请自行抉择
    clear() {
        this.removeSelf();
    }

}
