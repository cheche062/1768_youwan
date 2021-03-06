//大厅
(function(){
    var hallScene = app.hallScene = function(options){
        this.sceneName = "hallScene";

        this.__super.call(this);
        this.init();
    }

    //继承 Sprite
    Laya.class(hallScene, "app.hallScene", Laya.Sprite);

    var _proto_ = hallScene.prototype;

    //初始化
    _proto_.init = function(){
        //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
        app.observer.subscribe(this.sceneName + "_enter",this.onEnter.bind(this));
    }

    _proto_.onEnter = function(){
        app.utils.log(this.sceneName + " enter");
        //取消订阅时不用传递回调函数
        app.observer.unsubscribe(this.sceneName + "_enter");
    }

    _proto_.onExit = function(){
        app.utils.log(this.sceneName + " exit");

        //发布退出事件
        app.observer.publish(this.sceneName + "_exit");
        this.clear();
    }

    //自定义方法，场景退出的时候是销毁还是removeself请自行抉择
    _proto_.clear = function(){
        this.destroy(true);
    }
})();