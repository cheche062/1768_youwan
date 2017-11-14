/*
 *  帮助页
 */
{
    const app = window.app;
    const rechargePopUI = window.rechargePopUI;

    class RechargePopDialog extends rechargePopUI {
        constructor(...args) {
            super(...args);
            this.init();
        }

        init() {

            this.initDom();

            this.initConfig();

            // 初始化事件
            this.initEvent();

            // 注册
            this.registerAction();

        }

        // 注册
        registerAction() {
            // app.messageCenter.registerAction("rankInfomation", this.renderUserAmount.bind(this))


            // 订阅弹层
            app.observer.subscribe('rechargePopShow', this.myShow.bind(this));


        }

        // 触发
        dispatchAction() {



        }

        initDom() {
            // 输入框值
            this.input_txt = this.btn_input.getChildByName('input_txt');
            this.input_txt.text = '100';

        }

        // 初始化配置参数
        initConfig() {
            this.config = {
                rechargeNum: ['10', '50', '100', '500'],
                info: '请输入大于0的整数'
            }
        }

        initEvent() {

            // 确定充值
            this.btn_buy.on(Laya.Event.CLICK, this, this.ensureFn);

            // 输入框
            this.btn_input.on(Laya.Event.CLICK, this, this.showKeyBoardNumber);

            this.tab_nav.selectHandler = Laya.Handler.create(this, this.tabBtnChoose, null, false);

        }

        // 显示键盘
        showKeyBoardNumber() {
            // let txt = this.input_txt.text;
            app.keyBoardNumber_ui_pop.enter('', {
                    length: 8,
                    close: this.hideKeyBoardNumber.bind(this),
                    input: null
                }
            );

        }

        // 键盘退出
        hideKeyBoardNumber(type, value) {
            if (type === "confirm") {
                let _index = this.config.rechargeNum.indexOf(String(value));
                this.input_txt.text = value;
                this.tab_nav.selectedIndex = _index;
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

                // 提示页面跳转
                // app.observer.publish('commonPopShow', '正在跳转中...');

                _targetUrl = `/?act=payment&gameId=${pplgameId}&tradeName=${gameName}&amount=${shuoldPay}&platform=${gameplatform}&redirect_uri=${currentUrl}`;

                window.location.href = _targetUrl;
            }
        }



        // 出现
        myShow() {

            // 触发
            this.dispatchAction();

            this.popup();
        }


    }

    app.RechargePopDialog = RechargePopDialog;


}
