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
        //订阅场景加载事件
        app.observer.subscribe(this.sceneName + "_enter",this.onEnter.bind(this));
    }

    _proto_.onEnter = function(){
        app.utils.log(this.sceneName + " enter");
        //取消订阅
        app.observer.unsubscribe(this.sceneName + "_enter",this.onEnter.bind(this));

        var ui = new ui();
        this.addChild(ui)
    }

    _proto_.onExit = function(){
        app.utils.log(this.sceneName + " exit");

        //发布退出事件
        app.observer.publish(this.sceneName + "_exit");
    }

    //自定义方法，场景退出的时候是销毁还是removeself请自行抉择
    _proto_.clear = function(){
        this.destroy(true);
    }
})();