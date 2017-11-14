/*
 *  帮助页
 */
{
    const app = window.app;
    const helpPopUI = window.helpPopUI;

    class HelpPopUIDialog extends helpPopUI {
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

            // 订阅弹层出现
            app.observer.subscribe('helpPopShow', this.myShow.bind(this));


        }

        // 触发
        dispatchAction() {

          

        }

        initDom() {

            // 初始化帮助页滑动效果
            new window.zsySlider(this.help_glr);


        }

        // 初始化配置参数
        initConfig() {
            this.config = {

            }
        }

        initEvent() {
            this.getChildByName('close1').on(Laya.Event.CLICK, this, this.close);
            this.getChildByName('close2').on(Laya.Event.CLICK, this, this.close);
        }



        // 出现
        myShow(){

            // 触发
            this.dispatchAction();

            this.popup();
        }


    }

    app.HelpPopUIDialog = HelpPopUIDialog;


}
