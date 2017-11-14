/*
 *  公共弹层
 */
export class CommonTipsPopDialog extends commonPopTipsUI {
    constructor(...args) {
        super(...args);
        this.init();
    }

    init() {
        this.initDom();

        this.initConfig();

        this.initEvent();
    }

    registerAction({ messageCenter, observer }) {

        // 订阅弹层出现
        observer.subscribe('common::tips', this.myShow.bind(this));
    }

    initDom() {
        // 关闭按钮
        this.btn_close = this.getChildByName("close_btn");

        // 确定按钮
        this.btn_sure = this.getChildByName("btn_sure");
    }

    initConfig() {
        this.config = {
            limitTime: false, //限制时间
            popBgHeight: 420,
            btnSureY: 325
        }

        this.confirmCallBack = null; //确认回调
        this.cancelCallBack = null; //取消回调
    }

    initEvent() {
        // 关闭按钮
        this.btn_close.on(Laya.Event.CLICK, this, () => {
            this.cancelCallBack && this.cancelCallBack();
            this.myClose();

        });

        // 确定关闭按钮
        this.btn_sure.on(Laya.Event.CLICK, this, () => {
            this.confirmCallBack && this.confirmCallBack();
            this.myClose();
        });

    }

    myShow(txt, confirmCallBack, cancelCallBack) {

        this.pop_bg.height = this.config.popBgHeight;
        this.btn_sure.y = this.config.btnSureY;
        this.txt_content.text = txt;

        let txt_height = this.txt_content.displayHeight;

        if (txt_height > 90) {
            let _height = txt_height - 90;

            this.pop_bg.height += _height;
            this.btn_sure.y += _height;
        }

        this.confirmCallBack = confirmCallBack;
        this.cancelCallBack = cancelCallBack;

        // 需要取消回调
        if (cancelCallBack) {
            window.UIConfig.closeDialogOnSide = false;

        } else {
            Laya.timer.once(5000, this, this.myClose);
        }

        this.popup();

    }

    myClose() {
        this.close();
        window.UIConfig.closeDialogOnSide = true;
        this.confirmCallBack = null;
        this.cancelCallBack = null;
        Laya.timer.clear(this, this, this.myClose);
    }

}




export class CommonMatchPopDialog extends commonPopMatchUI {
    constructor(...args) {
        super(...args);
        this.init();
    }

    init() {
        this.initDom();

        this.initConfig();

        this.initEvent();
    }

    // 注册
    registerAction({ messageCenter, observer }) {

        // 订阅弹层
        observer.subscribe('common::match', this.myShow.bind(this));
    }

    initDom() {
        // 关闭按钮
        this.btn_close = this.getChildByName("close_btn");

        // 确定按钮
        this.btn_sure = this.getChildByName("btn_sure");
    }

    initConfig() {
        this.config = {
            limitTime: false, //限制时间
            popBgHeight: 383,
            btnSureY: 363

        }

        this.callback = null;
    }

    initEvent() {
        // 关闭按钮
        this.btn_close.on(Laya.Event.CLICK, this, this.close);

        // 确定关闭按钮
        this.btn_sure.on(Laya.Event.CLICK, this, this.myClose);


    }

    myShow(txt, callback) {

        this.pop_bg.height = this.config.popBgHeight;
        this.btn_sure.y = this.config.btnSureY;
        this.txt_content.text = txt;

        let txt_height = this.txt_content.displayHeight;

        if (txt_height > 70) {
            let _height = txt_height - 70;

            this.pop_bg.height += _height;
            this.btn_sure.y += _height;
        }

        if (typeof callback === 'function') {
            this.callback = callback;

        } else {
            this.callback = null;
        }

        this.popup();
        Laya.timer.once(5000, this, this.close);

    }

    myClose() {
        Laya.timer.clear(this, this.close);

        if (typeof this.callback === 'function') {
            this.callback();
            this.callback = null;
        }

        this.txt_content.text = '';
        this.close();
    }

}
