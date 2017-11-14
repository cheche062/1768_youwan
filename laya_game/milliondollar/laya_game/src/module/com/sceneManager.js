import { observer } from '../init_module.js';

//场景管理模块
export class SceneManagerModule {
    constructor() {
        this.currentScene = null;
        this.nextScene = null;
    }

    //加载场景
    loadScene(sceneobj) {
        this.nextScene = sceneobj || this.nextScene;

        //如果当前场景不为空，那么调用当前场景的退出功能，并且订阅当前场景退出事件，以便触发loadNextScene加载下一个需要加载的场景
        if (this.currentScene != null) {
            observer.subscribe(this.currentScene.sceneName + "_exit", this.loadNextScene.bind(this));
            this.currentScene.onExit();
        } else {
            this.currentScene = this.nextScene;
            //添加到stage上
            Laya.stage.addChild(this.currentScene);
            //发布场景加载事件
            observer.publish(this.currentScene.sceneName + "_enter");
        }
    }

    //加载下一个场景
    loadNextScene() {
        //取消订阅
        observer.unsubscribe(this.currentScene.sceneName + "_exit");
        //将当前场景置空
        this.currentScene = null;
        this.loadScene();
    }
}
