import { observer, messageCenter } from '../../module/init_module';
import CommonGameModule from '../../module/com/commonGameModule';
import { _ } from '../../common/underscore.1.7.0.min';
import { MATCH_DATA } from '../../config/data';
import UTILS from '../../config/utils';
import CMDS from '../../config/cmd';
import RoomScene from '../room';


const CLICK = Laya.Event.CLICK;
let debounced = _.debounce(() => { observer.publish('match::tab') }, 600, true);


// 管理大赛的打开和合起
export class RoomMatch extends Laya.Box {
    constructor() {
        super();

        this.init();
        RoomMatch.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {
        this.isInMatch = false; // 是否在比赛中
        this.nextTime = null; //下次比赛时间

        this.domMatchCloseUi = MatchCloseUIView.getInstance();
        this.domMatchOpenUi = MatchOpenUIView.getInstance();

        // 添加元素
        this.addChildren(this.domMatchCloseUi, this.domMatchOpenUi);

        // 创建倒计时器
        this.timeCountDown = UTILS.createTimeCountDown();
    }

    // 更新数据
    updateDataInfo(data) {
        let isInMatch = data.isInMatch > 0 && String(data.endTime) !== "0";
        let hasPrevue = String(data.nextTime.start) !== '0';
        this.nextTime = null;
        // 首先隐藏
        this.domMatchCloseUi.renderCountDownInfo(false);

        // 关于预告的部分（有没有预告都需要渲染）
        let { titleTxt, contentTxt } = this.dealWithPrevueInfo(data.nextTime);
        this.domMatchCloseUi.renderPrevueInfo(titleTxt, contentTxt);

        switch (true) {
            // 1 未比赛 && 没预告
            case (!isInMatch && !hasPrevue):
                this.updateMatchState(false);
                this.domMatchOpenUi.renderMiddleBoxInfo(titleTxt, contentTxt);

                break;

                // 2 未比赛 && 有预告
            case (!isInMatch && hasPrevue):
                this.updateMatchState(false);
                this.domMatchOpenUi.renderMiddleBoxInfo(titleTxt, contentTxt);

                // 预告剩余时间
                var totalTime = parseInt(data.restSeconds);

                this.nextTime = data.nextTime;
                // 开启当前比赛剩余时间倒计时
                this.timeCountDown && this.timeCountDown.clear();

                // 预告倒计时
                this.timeCountDown.start(totalTime, (time) => {
                    this.domMatchCloseUi.renderCountDownInfo('下次开启剩余', UTILS.toDetailTime(time));

                    // 预告结束开始比赛
                }, () => {
                    this.updateDataInfo({
                        isInMatch: 1,
                        endTime: this.nextTime.end,
                        currentTime: this.nextTime.start,
                        nextTime: {start: '0'}
                    });
                    RoomScene.getInstance().addBacklogList(() => observer.publish('pop::match::start'))
                });

                break;

                // 3 比赛中 && 没预告
            case (isInMatch && !hasPrevue):
                // 4 比赛中 && 有预告
            case (isInMatch && hasPrevue):
                this.updateMatchState(true);

                // 比赛剩余时间
                var totalTime = parseInt(data.restSeconds);

                // 开启当前比赛剩余时间倒计时
                this.timeCountDown && this.timeCountDown.clear();

                // 比赛倒计时
                this.timeCountDown.start(totalTime, (time) => {
                    let titleTxt = '当前比赛剩余时间';
                    let contentTxt = UTILS.toDetailTime(time);
                    this.domMatchCloseUi.renderCountDownInfo(titleTxt, contentTxt);
                    this.domMatchOpenUi.renderMiddleBoxInfo(titleTxt, contentTxt);
                }, () => {
                    let titleTxt = '当前比赛结算中...';
                    let contentTxt = '';
                    this.domMatchCloseUi.renderCountDownInfo(titleTxt, contentTxt);
                    this.domMatchOpenUi.renderMiddleBoxInfo(titleTxt, contentTxt);
                });

                // 循环请求当前比赛结果排名
                this.emitMatchRank();
                Laya.timer.clear(this, this.emitMatchRank);
                Laya.timer.loop(30 * 1000, this, this.emitMatchRank);

                break;
        }
    }

    // 请求比赛排名
    emitMatchRank() {
        messageCenter.emit(CMDS.SOCKET__MATCH__RANK);
    }

    // 上期排名
    emitLastMatch() {
        // 请求数据上期分奖数据
        messageCenter.emit(CMDS.SOCKET__LAST__MATCH);
        Laya.timer.clear(this, this.emitMatchRank);

    }

    // 比赛结束
    matchResultHandler(data) {
        this.domMatchOpenUi.matchResultHandler(data);
        Laya.timer.clear(this, this.emitMatchRank);

    }

    // 处理下次预告的数据
    dealWithPrevueInfo(nextTime) {
        let titleTxt, contentTxt;

        if (Number(nextTime.start) === 0) {
            contentTxt = '敬请期待';
        } else {
            let arr = nextTime.start.split(' ');
            let date = arr[0];
            let start = arr[1].slice(0, arr[1].lastIndexOf(':'));
            let end = nextTime.end.split(' ')[1];
            end = end.slice(0, end.lastIndexOf(':'));
            contentTxt = `${date}\n${start} - ${end}`;
        }
        titleTxt = '下次比赛';

        return { titleTxt, contentTxt };
    }

    // 更新比赛的状态
    updateMatchState(bool) {
        this.isInMatch = bool;
    }

    // 奖池金额
    renderAmount(data) {
        this.domMatchCloseUi.renderAmount(data);
        this.domMatchOpenUi.renderAmount(data);
    }


}

/**************************************************************************/

// 大赛收起
export class MatchCloseUIView extends match_closeUI {
    constructor() {
        super();

        this.init();
        MatchCloseUIView.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {

        // 初始隐藏
        this.visible = false;

        this.initEvent();

        observer.subscribe('match::tab', this.stateChange.bind(this));

    }

    // 下次比赛预告 &&  (title, content)
    renderPrevueInfo(titleTxt, contentTxt) {
        this.prevue_box.dataSource = { title: titleTxt, content: contentTxt };
    }

    // 渲染倒计时
    renderCountDownInfo(titleTxt, contentTxt) {
        this.count_down_box.visible = false;
        if (titleTxt) {
            this.count_down_box.dataSource = { title: titleTxt, content: contentTxt };
            this.count_down_box.visible = true;
        }
    }

    initEvent() {
        this.btn_tab.on(CLICK, this, debounced);
    }

    // 奖池金额
    renderAmount(data) {
        if (data) {
            this.domAmount.text = data;
        }
    }

    // 状态变换
    stateChange() {
        this.visible = !this.visible;
    }

}



// 大赛展开
export class MatchOpenUIView extends match_openUI {
    constructor() {
        super()

        this.init()
        MatchOpenUIView.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {

        this.initEvent();

        observer.subscribe('match::tab', this.stateChange.bind(this));
    }

    initEvent() {
        this.btn_tab.on(CLICK, this, debounced);

        this.btn_last.on(CLICK, this, () => {
            messageCenter.emit('lastMatch');
            observer.publish("pop::match::history");
        });

        // 比赛规则
        this.btn_match.on(CLICK, this, () => {
            observer.publish(CMDS.POP__HELP, 2);
        });
    }

    // 状态变换
    stateChange() {
        this.visible = !this.visible;
    }

    // 上期比赛分奖
    lastMatchHandler(data) {
        if (!RoomMatch.getInstance().isInMatch) {
            this.tabTitleBox('last');
            this.renderList(data.info);
            this.myRank(data.userInfo);
        }
    }

    // 即时比赛排名
    matchRankHandler(data) {
        if (RoomMatch.getInstance().isInMatch) {
            this.tabTitleBox('match');
            this.renderList(data.info);
            this.myRank(data.myRank);
        }
    }

    tabTitleBox(name) {
        this.tab_title_box.getChildByName('last').visible = false;
        this.tab_title_box.getChildByName('match').visible = false;
        this.tab_title_box.getChildByName(name).visible = true;
    }

    // 奖池金额
    renderAmount(data) {
        if (data) {
            this.domAmount.text = data;
        }
    }

    // 比赛结束
    matchResultHandler(data) {
        this.tabTitleBox('last');

        // 渲染比赛结果数据
        this.renderList(data.result);
        this.myRank(data.myRank);
    }

    // 中间box 预告 && 比赛倒计时  (title, content)
    renderMiddleBoxInfo(titleTxt, contentTxt) {
        this.middle_box.dataSource = { title: titleTxt, content: contentTxt };
    }

    // 排名列表
    renderList(data) {
        let result = [];
        if (!data.length) {
            this.dom_nobody.visible = true;
            this.list_box.visible = false;
            return;
        }

        data.forEach((item, index) => {
            result.push({
                icon: index,
                rank: index + 1,
                name: UTILS.getActiveStr(item.user_name, 6),
                amount: UTILS.toWanSymbol(item.win_amount || item.extra_amount)
            })
        })

        this.dom_nobody.visible = false;
        this.list_box.visible = true;
        this.list_box.array = result;
    }

    // 我的排名
    myRank(data) {
        let rank = data.rank;
        let amount, content;
        if (data.hasOwnProperty("extra_amount")) {
            amount = data.extra_amount;
            content = '分得总额: ';
        } else {
            amount = data.win_amount;
            content = '赢取总额: ';
        }
        this.bottom_box.dataSource = {
            title: '我的排名: ' + (Number(rank) ? rank : '>50'),
            content: content + amount
        }
    }

}
