/*
 *  充值页
 */

// 键盘
export class RechargePopDialog extends rechargePopUI {
    constructor(...args) {
        super(...args);
        this.init();
    }

    init() {

        this.initDom();

        this.initConfig();

        // 初始化事件
        this.initEvent();

        this.keyBoardNumber = new window.Tools.KeyBoardNumber();

    }

    // 注册
    registerAction({messageCenter, observer}) {
        // messageCenter.registerAction("rankInfomation", this.renderUserAmount.bind(this))

        // 订阅弹层
        observer.subscribe('pop::recharge', this.myShow.bind(this));

    }


    initDom() {
       // 关闭按钮
        this.dom_close_btn = this.getChildByName("close_btn");

        // 输入框值
        this.input_txt = this.btn_input.getChildByName('input_txt');
        this.input_txt.text = '100';

    }

    // 初始化配置参数
    initConfig() {
        this.config = {
            rechargeNum: ['10', '50', '100', '200'],
            info: '请输入大于0的整数'
        }
    }

    initEvent() {
        // 关闭按钮
        this.dom_close_btn.on(Laya.Event.CLICK, this, this.close);
        // 确定充值
        this.btn_buy.on(Laya.Event.CLICK, this, this.ensureFn);

        // 输入框
        this.btn_input.on(Laya.Event.CLICK, this, this.showKeyBoardNumber.bind(this));

        this.tab_nav.selectHandler = Laya.Handler.create(this, this.tabBtnChoose, null, false);

    }

    // 显示键盘
    showKeyBoardNumber() {
        this.keyBoardNumber.enter('', {
            length: 8,
            close: this.hideKeyBoardNumber.bind(this),
            input: null
        });

    }

    // 键盘退出
    hideKeyBoardNumber(type, value) {
        let _index = this.config.rechargeNum.indexOf(String(value));

        if (type === "confirm" && value) {    
            this.input_txt.text = value;
            this.tab_nav.selectedIndex = _index;
        }else if(type === "confirm" && !value){
            this.input_txt.text = this.config.rechargeNum[2];
            this.tab_nav.selectedIndex = 2;
        }
    }

    // 选中金额的tab切换
    tabBtnChoose(index) {
        if (index === -1) {
            return;
        }

        this.input_txt.text = this.config.rechargeNum[index];

    }

    // 确定购买
    ensureFn() {
        let pplgameId = window.gameId;
        let gameName = window.tradeName;
        let shuoldPay = this.input_txt.text;
        let gameplatform = window.platform;
        let currentUrl = window.redirect_uri;
        let _targetUrl = '';
        if (Number(shuoldPay) > 0) {
            _targetUrl = `/?act=payment&gameId=${pplgameId}&tradeName=${gameName}&amount=${shuoldPay}&platform=${gameplatform}&redirect_uri=${currentUrl}`;

            window.location.href = _targetUrl;
        }
    }

    // 出现
    myShow() {

        this.popup();
    }



}
