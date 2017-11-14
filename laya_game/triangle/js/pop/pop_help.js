/*
 *  帮助页
 */
{
    const app = window.app;
    const pop_helpUI = window.pop_helpUI;

    class HelpPopUIDialog extends pop_helpUI {
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
            // app.messageCenter.registerAction("help", this.renderRateHandler.bind(this))

            // 订阅弹层出现
            app.observer.subscribe('helpPopShow', this.myShow.bind(this));
            app.observer.subscribe('helpRenderTate', this.renderRateHandler.bind(this));


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

        // 渲染倍率
        renderRateHandler(data){

            this.dom_text.text = data.max + '%';

        }

        // 出现
        myShow(){

            this.popup();
        }


    }

    app.HelpPopUIDialog = HelpPopUIDialog;


}
