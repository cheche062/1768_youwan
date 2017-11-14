// loading页
{
    const app = window.app;

    class LoadingScene extends window.loadingUI {
        constructor() {
            super();

            this.sceneName = "loadingScene";
            this.init();
        }

        //初始化
        init() {

            this.initDom();

            this.initConfig();

            this.initState();

            //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
            app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
        }

        onEnter() {

            // 视图居中
            app.setViewCenter();

            app.utils.log(this.sceneName + " enter");

            //取消订阅时不用传递回调函数
            app.observer.unsubscribe(this.sceneName + "_enter");

        }

        initDom() {
            this.dom = {};
            let process_box = this.middle_box.getChildByName('process_box');
            this.dom.green_box = process_box.getChildByName('green_box');
            this.dom.green = this.dom.green_box.getChildByName('green');
            this.dom.light = this.dom.green_box.getChildByName('light');

            let logo_box = this.middle_box.getChildByName('logo_box');
            this.dom.logo = logo_box.getChildByName('logo');

        }

        // 初始化配置
        initConfig() {
            this.config = {};
            this.config.MAX_WIDTH = 736;

        }

        initState(){
            this.dom.green.width = 0;
            this.dom.green_box.width = 0;
            this.dom.light.right = 0;

        }

        // 加载运动条
        loading(percent) {
            let per = Math.floor(percent * 100);
            let w = per / 100 * this.config.MAX_WIDTH;
            w = w < 30 ? 30 : w;
            this.dom.green.width = w;
            this.dom.green_box.width = w;
        }

        // 退出场景
        onExit() {
            app.utils.log(this.sceneName + " exit");

            //发布退出事件
            app.observer.publish(this.sceneName + "_exit");

            this.clear();
        }

        //自定义方法，场景退出的时候是销毁还是removeself请自行抉择
        clear() {
            this.destroy(true);
        }

    }

    app.LoadingScene = LoadingScene;

}
