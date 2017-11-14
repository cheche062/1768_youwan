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

            //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
            app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
        }

        onEnter() {

            app.utils.log(this.sceneName + " enter");

            //取消订阅时不用传递回调函数
            app.observer.unsubscribe(this.sceneName + "_enter");

        }

        initDom() {

           
        }

        // 加载运动条
        loading(percent) {
            let per = Math.floor(percent*100);
            let w = per/100*600;
            this.dom_process_txt.text = per>97? 100 + '%' : per + '%';
            this.dom_process_img.width = w<30? 30 : w;
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
