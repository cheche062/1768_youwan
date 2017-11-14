/**
 * Bottom ui visualization of the data that model contains.
 *底部
 * @class      BottomUIView (name)
 */
import CMDS from '../config/cmd';
import UTILS from '../config/utils';
import GAME_CONFIG from '../config/config';
import { AUTOPLAY_TIMES, DEFAULT_AMOUNT } from '../config/data';
import HeaderUIView from './header';
import RoomScene from './room';
import { messageCenter, observer } from '../module/init_module';
import OptionsUIView from './com/options';
import GainNoticeUIView from './com/gainNotice';
import GoodJobUIView from './com/goodJob';
import { clickOtherAreaHandler, addLongClickEvent } from '../common/laya.custom';
import CommonGameModule from '../module/com/commonGameModule';
import AudioMudule from '../module/com/audio';


const CLICK = Laya.Event.CLICK;

export default class BottomUIView extends bottomUI {
    constructor() {
        super();
        this.init();

        BottomUIView.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {
        this.initDom();
        this.initConfig();
        this.initEvent();

        this.subscribe();

    }

    // 订阅
    subscribe() {
        // 游戏停止
        observer.subscribe('lapa::stop', this.lapaStop.bind(this));
        // 投币成功
        observer.subscribe('bet::success', this.betSuccess.bind(this));
        // 投币额修改
        observer.subscribe('bet::inputamount', this.updateDomInput.bind(this));
        // 游戏重置
        observer.subscribe('game::reset', this.reset.bind(this));

    }

    initConfig() {
        this.config = {
            gameStatus: 'ready', //游戏状态     'ready' 准备完毕, 'going' 游戏中, 'auto'自动玩中
            MIN_INPUT: 250,
            MAX_INPUT: 500000,
            base: 250,
            user_input_text: 250, //投币金额
            isAuto: 0, //是否是自动玩
            autoTimes: 0 // 自动玩的次数
        }
    }

    initDom() {
        // 选项列表的公共配置参数
        const options = {
            buttonUrl: "images/room/btn_bg.png",
            bgUrl: 'images/load/morebg.png',
            labelFont: 'button_font'
        }

        // 默认投币额
        options.itemList = DEFAULT_AMOUNT;
        options.clickHandler = (num) => {
            // 游戏进行中判断
            if (this.btnDisAble()) return;
            AudioMudule.getInstance().play('btn');

            this.updateDomInput(num);
        }
        this.defaultbet_box.addChild(new OptionsUIView(options));

        // 添加自动次数玩选项表
        options.itemList = AUTOPLAY_TIMES;
        options.clickHandler = (i) => {
            if (this.checkEnoughBet()) {
                AudioMudule.getInstance().play('btn_start');

                this.renderStartBtnStatus('auto', i);
            }
        };
        this.autoplay_box.addChild(new OptionsUIView(options));

    }

    initEvent() {
        // 减法加法按钮
        this.btn_sub.on(CLICK, this, this.addSubHandler.bind(this, 'sub'));
        this.btn_add.on(CLICK, this, this.addSubHandler.bind(this, 'add'));

        // 最大按钮
        this.btn_max.on(CLICK, this, this.maxHandler);

        // 投币输入框
        this.btn_input.on(CLICK, this, () => {
            // 游戏进行中判断
            if (this.btnDisAble()) return;

            this.defaultbet_box.getChildAt(0).toggle();
        });

        // 帮助页
        this.btn_i.on(CLICK, this, () => {
            AudioMudule.getInstance().play('btn');
            observer.publish(CMDS.POP__HELP);
        });

        // 开始按钮添加事件(短按事件， 长按事件)
        addLongClickEvent(this.btn_start, this.startGame.bind(this), this.showAutoPlay.bind(this));

        // 点击其它区域菜单隐藏
        clickOtherAreaHandler(this.btn_input, this.defaultbet_box);
        clickOtherAreaHandler(this.btn_start, this.autoplay_box);

    }

    // 短按 - 开始游戏
    startGame() {
        switch (this.config.gameStatus) {
            case 'ready':
                // 余额是否够
                if (this.checkEnoughBet()) {
                    this.emit();
                    this.renderStartBtnStatus('going');
                    AudioMudule.getInstance().play('btn_start');
                    this.config.gameStatus = 'going';
                }

                break;

            case 'going':
                console.log('游戏进行中不可点...');
                break;

            case 'auto':
                this.renderStartBtnStatus('going');
                break;
        }
    }

    // 渲染开始按钮的状态
    renderStartBtnStatus(type, i) {
        switch (type) {
            case 'ready':
                this.dom_start_sk.play('ready', true);
                break;

            case 'going':
                this.autoplay_box.getChildAt(0).hide();
                this.dom_auto.visible = false;
                this.dom_auto.text = 0;
                this.config.isAuto = 0;
                this.config.autoTimes = 0;
                this.dom_start_sk.play('disable', false);

                break;

            case 'auto':
                this.config.isAuto = 1;
                this.config.autoTimes = Number(i) - 1;
                this.dom_auto.text = this.config.autoTimes;
                this.dom_auto.visible = true;
                this.dom_start_sk.play('auto', false);

                // 发送命令
                this.emit();

                // 最后一次自动玩
                if (this.config.autoTimes === 0) {
                    this.renderStartBtnStatus('going');
                    return;
                }

                break;
        }

        this.config.gameStatus = type;

    }

    // 长按 - 弹层自动玩
    showAutoPlay() {
        // 游戏进行中判断
        if (this.btnDisAble()) return;

        AudioMudule.getInstance().play('btn');

        this.autoplay_box.getChildAt(0).toggle();
    }

    // 当局游戏停止判断游戏下一步（继续自动玩 || 准备完毕）
    lapaStop(total, allMatch) {
        // 有中奖金额
        if (total > 0) {
            // 非自动玩才弹赢弹层
            if (this.config.gameStatus !== 'auto') {
                let winPopShow = () => {
                    let cb = () => {
                        // 动态渲染获得金额
                        this.renderWinAmount(total);
                        this.gameNext();
                    }

                    // 中奖金额是投币金额的5倍以下
                    if (total / this.config.user_input_text <= 5) {
                        cb();
                    } else {
                        Laya.timer.once(2000, this, () => observer.publish('pop::win', total, this.config.user_input_text, cb));
                    }
                }

                // 判断是否福袋中奖(如果福袋中奖首先福袋弹层，然后在普通中奖弹层)
                if (Number(allMatch.extra_amount) > 0) {
                    Laya.timer.once(2000, this, () => observer.publish('pop::baida', Number(allMatch.num), Number(allMatch.extra_amount), winPopShow));
                } else {
                    winPopShow();
                }

                // 自动玩则不弹弹层在数字金额动画之后再进行下一步
            } else {
                // 动态渲染获得金额
                this.renderWinAmount(total, () => Laya.timer.once(2000, this, this.gameNext));
            }

            // 更新用户余额
            observer.publish('update::useraccount', total);

            // 没有中奖金额直接游戏下一步
        } else {
            // 没有中奖调一下
            CommonGameModule.getInstance().jiujijin();

            // 自动玩情况下需要等待1.5秒
            if (this.config.gameStatus === 'auto') {
                Laya.timer.once(1500, this, this.gameNext);
            } else {
                this.gameNext();
            }
        }
    }

    // 游戏下一步
    gameNext() {
        if (this.config.gameStatus === 'auto') {
            this.renderStartBtnStatus('auto', this.config.autoTimes);

        } else {
            this.renderStartBtnStatus('ready');
        }

        // 当局结束
        observer.publish("game::stop");
    }

    // 开始下一局发送命令
    emit() {
        this.dom_25.index = 0;
        this.dom_win.visible = false;

        observer.publish(CMDS.GAME__START);
        messageCenter.emit(CMDS.SOCKET__BET, { amount: this.config.user_input_text, isAuto: this.config.isAuto });
    }

    // 投币成功
    betSuccess() {
        // 更新用户余额
        observer.publish('update::useraccount', -1 * this.config.user_input_text);

        // 设置默认投币额
        UTILS.setCookie("defaultBet" + GM.gameId + GM.user_id, this.config.user_input_text);
    }

    // max最大值按钮
    maxHandler() {
        // 未登录
        if (UTILS.willGotoLogin()) return;
        // 游戏进行中判断
        if (this.btnDisAble()) return;

        AudioMudule.getInstance().play('btn_add');

        let header = HeaderUIView.getInstance();
        let current = Math.max(header.config.yuNum, header.config.tingDou);
        current = current - current % this.config.base;
        current = Math.max(current, this.config.MIN_INPUT);
        current = Math.min(current, this.config.MAX_INPUT);

        this.btn_max.disabled = true;

        this.updateDomInput(current);
    }

    // 减法加法
    addSubHandler(type) {
        // 未登录
        if (UTILS.willGotoLogin()) return;
        // 游戏进行中判断
        if (this.btnDisAble()) return;

        let config = this.config;
        let current = UTILS.addSubHandler(type, config.base, config.MIN_INPUT, config.MAX_INPUT, config.user_input_text);

        this.btn_max.disabled = false;

        AudioMudule.getInstance().play('btn_' + type);
        this.updateDomInput(current);
    }

    // 修改投币金额
    updateDomInput(num) {
        let _num = Number(num) || this.config.MIN_INPUT;
        this.input_txt.text = _num;
        this.config.user_input_text = _num;

        if (_num === this.config.MIN_INPUT) {
            this.btn_sub.disabled = true;
        } else {
            this.btn_sub.disabled = false;
        }

        if (_num === this.config.MAX_INPUT) {
            this.btn_add.disabled = true;
            this.btn_max.disabled = true;
        } else {
            this.btn_add.disabled = false;
            this.btn_max.disabled = false;
        }

        // 投币额修改触发奖池开启与否
        observer.publish('jackpot::open', _num);
    }

    // 动态渲染获得金额
    renderWinAmount(amount, callBack) {
        // 赢得
        this.dom_25.index = 1;
        let dom = this.dom_win;
        dom.visible = true;
        let target = Number(amount);
        let currentNum = 0;
        let step = Math.max(1, Math.floor(target * 2 / 100));

        let loop = () => {
            currentNum += step;
            if (currentNum >= target) {
                currentNum = target;

                // 动画结束后回调
                callBack && callBack();
            } else {
                if (dom.visible) {
                    Laya.timer.frameOnce(2, null, loop);
                }
            }

            dom.text = '$' + UTILS.addThousandSymbol(currentNum);
        }

        loop();
    }

    // 判断余额是否投币
    checkEnoughBet() {
        // 未登录
        if (UTILS.willGotoLogin()) return;

        let header = HeaderUIView.getInstance();
        let yuNum = header.config.yuNum;
        let tingDou = header.config.tingDou;
        let bet = this.config.user_input_text;

        let bool = GAME_CONFIG.localStatus || yuNum >= bet || tingDou >= bet;
        if (!bool) {
            observer.publish('common::tips', '余额不足，请充值...', () => observer.publish('pop::recharge'));
        }

        return bool;

    }

    // 游戏进行中 按钮不可点
    btnDisAble() {
        let bool = this.config.gameStatus !== 'ready';
        if (bool) {
            console.log('不可点...');
        }

        return bool;
    }

    reset() {
        this.renderStartBtnStatus('ready');
        this.config.isAuto = 0;
        this.config.autoTimes = 0;
        this.dom_auto.visible = false;

    }

}
