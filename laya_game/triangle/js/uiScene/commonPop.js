/*
 *  惊喜奖
 */
{
    const app = window.app;
    const commonPopUI = window.commonPopUI;

    class CommonPopUIDialog extends commonPopUI {
        constructor(...args) {
            super(...args);
            this.init();
        }

        init() {

            this.initDom();

            this.initEvent();
            this.initConfig();

            // 注册
            this.registerAction();

        }

        // 注册
        registerAction() {
            // 订阅弹层出现
            app.observer.subscribe('commonPopShow', this.myShow.bind(this));
            app.observer.subscribe('commonPopHide', this.close.bind(this));
        }

        initDom() {
            // 取消按钮
            this.btn_cancel = this.getChildByName('btn_cancel');
            this.btn_myClose = this.getChildByName('btn_myClose');

            // 确定按钮
            this.btn_confirm = this.getChildByName('btn_confirm');

            // 文案
            this.dom_text = this.text_box.getChildByName('text');

        }

        initEvent(){
            this.btn_cancel.on(Laya.Event.CLICK, this, this.myClose);
            this.btn_myClose.on(Laya.Event.CLICK, this, this.myClose);

            this.btn_confirm.on(Laya.Event.CLICK, this, this.myConfirm);



        }

        // 初始化配置参数
        initConfig() {
            this.config = {
               confirmCallBack: null,   //确定的回调
               cancelCallBack: null     //取消的回调
            }
        }

        // 出现
        myShow(text, callback1, callback2, delay) {
            this.config.confirmCallBack = callback1;
            this.config.cancelCallBack = callback2;

            this.dom_text.text = text;
            this.dom_text.y = (this.text_box.height - this.dom_text.height) / 2;

            this.popup();

            // 默认时间后消失
            if(typeof delay === 'number'){
                Laya.timer.once(1500, this, () => {this.myClose()});
            }

            // 如果取消有回调事件时
            if(typeof callback2 === 'function'){
                // 点击阴影无法关闭弹层
                window.UIConfig.closeDialogOnSide = false;
            }
        }

        // 关闭
        myClose() {
            if(typeof this.config.cancelCallBack === 'function'){
                this.config.cancelCallBack();
                this.config.cancelCallBack = null;
            }

            this.close();

            // 点击阴影可以关闭弹层
            window.UIConfig.closeDialogOnSide = true;
        }

        // 确定
        myConfirm() {
            if(typeof this.config.confirmCallBack === 'function'){
                this.config.confirmCallBack();
                this.config.confirmCallBack = null;
            }

            this.close();
        }


    }

    app.CommonPopUIDialog = CommonPopUIDialog;


}
