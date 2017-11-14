/**
 * Header ui visualization of the data that model contains.
 *头部
 * @class      HeaderUIView (name)
 */
import UTILS from '../config/utils';
import { observer, messageCenter } from '../module/init_module';
import CommonGameModule from '../module/com/commonGameModule';
import MenuUIView from './com/menu';
import { clickOtherAreaHandler } from '../common/laya.custom';
import AudioMudule from '../module/com/audio';


const CLICK = Laya.Event.CLICK;
const commonGameInstance = CommonGameModule.getInstance();

export default class HeaderUIView extends headerUI {
    constructor() {
        super()
        this.init()
        HeaderUIView.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {
        this.initDom();
        this.initEvent();
        this.initConfig();

        observer.subscribe('update::useraccount', this.updateUserYuDou.bind(this));

    }

    initConfig() {
        this.config = {
            tingDou: 0, //豆（左）
            yuNum: 0, //余（右）    
            isFirstDefault: false // 是否第一次默认押注金额提示
        }
    }

    initDom() {
        this.dom = {}
        this.dom.dou_num = this.dou_box.getChildByName('dou_num');
        this.dom.yu_num = this.yu_box.getChildByName('yu_num');

        // 添加菜单
        this.menu_box.addChild(MenuUIView.getInstance());
    }

    initEvent() {
        // 回退按钮
        commonGameInstance.isShowBtnBackHandler(this.btn_back);
        // 主页按钮
        commonGameInstance.isShowBtnHomeHandler(this.btn_home);

        this.yu_box.on(CLICK, this, this.yuNumPopBalanceShow.bind(this));

        this.btn_rank.on(CLICK, this, () => {
            AudioMudule.getInstance().play('btn');
            observer.publish("pop::rank", messageCenter);
        })

        this.btn_more.on(CLICK, this, () => {
            AudioMudule.getInstance().play('btn');
            this.menu_box.getChildAt(0).toggle();
        })

        this.btn_chong.on(CLICK, this, () => {
            AudioMudule.getInstance().play('btn');
            observer.publish("pop::recharge", messageCenter);
        })


        // 点击其它区域菜单隐藏
        clickOtherAreaHandler(this.btn_more, this.menu_box);

    }

    // 游戏中更新挺豆 & 余额
    updateUserYuDou(num) {
        // 增加余额
        if (num >= 0) {
            this._updateUserYu(num);

            // 扣减余额
        } else {
            //挺豆够扣的话就扣挺豆
            if (this.config.tingDou + num >= 0) {
                this._updateUserDou(num);

                //否则扣余额
            } else {
                this._updateUserYu(num);
            }
        }
    }

    // 更新用户余额（右边）
    _updateUserYu(num) {
        this.config.yuNum = Math.max(0, this.config.yuNum + num);
        this.dom.yu_num.text = UTILS.getActiveStr(this.config.yuNum, 10);

    }

    // 更新用户挺豆（左边）
    _updateUserDou(num) {
        this.config.tingDou = Math.max(0, this.config.tingDou + num);
        this.dom.dou_num.text = UTILS.getActiveStr(this.config.tingDou, 10);
    }

    // 渲染用户余额
    renderUserAccount(data) {
        let tingDou = Number(data.TCoin) || 0;
        let yuNum = (Number(data.total) - tingDou) || 0;

        this.config.tingDou = tingDou;
        this.config.yuNum = yuNum;
        this.dom.dou_num.text = UTILS.getActiveStr(tingDou, 10);
        this.dom.yu_num.text = UTILS.getActiveStr(yuNum, 10);

        this.defaultBetHandler(tingDou, yuNum);
    }

    // 默认投币额
    defaultBetHandler(tingDou, yuNum){
        let inputNum;

        // 仅一次
        if (this.config.isFirstDefault) {
            return;
        }
        this.config.isFirstDefault = true;

        // 获取默认投币额
        let defaultBet = UTILS.getCookie("defaultBet" + GM.gameId + GM.user_id);
        defaultBet = defaultBet ? parseInt(defaultBet, 10) : null;

        // 存在cookie默认投币额 && 小于平台子账户余额
        if (defaultBet && defaultBet <= yuNum) {
            inputNum = defaultBet;
        } else {
            // 默认押注金额提示
            inputNum = commonGameInstance.defaultInputNotice(tingDou, yuNum);
        }

        // 最后转数字
        inputNum = Math.min(Number(inputNum), 500000);
        inputNum = Math.max(Number(inputNum), 250);

        // 更新投币金额
        observer.publish('bet::inputamount', inputNum);

        // 默认押注额
        observer.publish('pop::defaultbet', "默认投币额：" + inputNum);
    }

    // 余额查询
    yuNumPopBalanceShow() {
        AudioMudule.getInstance().play('btn');

        // 未登录
        if (UTILS.willGotoLogin()) {
            return;
        }

        if (GM && GM.isCall_out === 1 && GM.popBalanceShow_out) {
            GM.popBalanceShow_out(GM.gameType);
        }

        // 更新余额
        messageCenter.emitAjax("userAccount");
    }



}
