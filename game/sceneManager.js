//场景
(function(){
    var sceneManagerModule = app.sceneManagerModule = function(options){
        this.currentScene = null;
        this.nextScene = null;

        this.__super.call(this);
        this.init();
    }

    //继承 Sprite
    Laya.class(sceneManagerModule, "app.sceneManagerModule", Laya.Sprite);

    var _proto_ = sceneManagerModule.prototype;

    _proto_.init = function(){

    }

    _proto_.loadScene = function(sceneobj){
        this.nextScene = sceneobj || this.nextScene;

        //如果当前场景不为空，那么调用当前场景的退出功能，并且订阅当前场景退出事件，以便触发loadNextScene加载下一个需要加载的场景
        if(this.currentScene != null){
            app.observer.subscribe(this.currentScene.sceneName + "_exit", this.loadNextScene.bind(this));
            this.currentScene.onExit();
        }
        else{
            this.currentScene = sceneobj;
            //添加到stage上
            Laya.stage.addChild(this.currentScene);
            //发布场景加载事件
            app.observer.publish(this.currentScene.sceneName + "_enter");
        }
    }

    _proto_.loadNextScene = function(){
        //取消订阅
        app.observer.unsubscribe(this.currentScene.sceneName + "_exit");
        //将当前场景置空
        this.currentScene = null;
        this.loadScene();
    }
})();