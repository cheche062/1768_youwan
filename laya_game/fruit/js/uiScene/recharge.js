// 充值弹框
{
    const app = window.app;
    const rechargeUI = window.rechargeUI;
    const keybordUI = window.keybordUI;

    class RechargeUIDialog extends rechargeUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initConfig();
            this.initDom();
            this.initEvent();

            // 注册挂载
            this.registerAction();

        }

        initConfig() {
            this.config = {
                rechargeNum: ['10', '50', '100', '200'],
                info: '请输入大于0的整数',
                HEIGHT: this.height //初始的高度
            }
        }

        initDom() {
            // 购买按钮
            this.btn_buy = this.input_box.getChildByName('btn_buy');
            // 输入框值
            this.input_txt = this.input_box.getChildByName('input_txt');
            this.input_txt.text = '100';

            // 添加键盘
            this.keybord_box.addChild(new keybordUI());
            this.keybord_box.visible = false;

        }

        initEvent() {
            this.btn_buy.on(Laya.Event.CLICK, this, this.ensureFn);

            this.btn_click.selectHandler = Laya.Handler.create(this, this.tabBtnChoose, null, false);

            this.keybord_box.on(Laya.Event.CLICK, this, this.enterKey);

            this.input_txt.on(Laya.Event.CLICK, this, this.keybordShow);

            this.btn_close.on(Laya.Event.CLICK, this, this.myClose);
        }

        // 注册
        registerAction() {
            // 弹层挂载
            app.observer.subscribe("rechargePopShow", this.myShow.bind(this));

        }

        keybordShow() {
            // 纪录居中时的y值
            this.config.centerY = this.y;

            if (this.input_txt.text === this.config.info) {
                this.input_txt.text = '';
            }

            this.keybord_box.visible = true;
            this.height = this.config.HEIGHT + this.keybord_box.height;
            Laya.Tween.to(this, { y: 0 }, 300, Laya.Ease.backOut);
        }

        enterKey(event) {
            let _target = event.target;
            let _name = _target.name;
            let _input = this.input_txt;
            let _txt = _input.text;

            if (_name.indexOf('num') > -1) {
                _input.text = _txt + _target.text;

                if (_input.text.length > 8) {
                    _input.text = _input.text.slice(0, 8);
                }

            } else if (_name === 'del') {
                _input.text = _txt.slice(0, _txt.length - 1);

            } else if (_name === 'sureBtn') {
                _input.text = +(_input.text) + '';

                if (_input.text === '' || _input.text === '0') {
                    _input.text = this.config.info;
                }

                // 回到居中位置
                this.resetHeight();
            }

            this.btn_click.selectedIndex = -1;

            this.handleTextInput();
        }

        handleTextInput() {
            let val = this.input_txt.text;
            this.config.rechargeNum.forEach((item, index) => {
                if (item === val) {
                    this.btn_click.selectedIndex = index;
                    return true;
                }
            })
        }

        // 重置居中位置(之所以要改变高度，是因为在父容器外的元素无法接受点击事件)
        resetHeight() {
            // 还原高度
            this.height = this.config.HEIGHT;
            this.keybord_box.visible = false;

            Laya.Tween.to(this, { y: this.config.centerY }, 300, Laya.Ease.backOut);

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

        myShow() {
            this.keybord_box.visible = false;
            this.popup();
        }

        myClose() {
            this.resetHeight();
            this.close();
        }

    }

    app.RechargeUIDialog = RechargeUIDialog;
}
