{
    {
        class Scene extends Laya.Box {
            constructor () {
                super();
            }
            onEnter () {}
            onExit () {}
            onResize (width, height) {}
        }

        Sail.class(Scene, "Sail.Scene");
    }
    {
        class SceneManager extends Laya.Box {
            constructor () {
                super();

                this.curScene = null;

                this.init();
            }
            destroy () {
                super.destroy.call(this, true);
                this.curScene = null;
            }

            init () {
                this.size(Laya.stage.width, Laya.stage.height);
            }

            run (scene) {
                this.addChild(scene);

                if(this.curScene){
                    if(this.curScene.onExit){
                        this.curScene.onExit();
                    }else{
                        this.curScene.destroy(true);
                    }
                }
                scene.onEnter && scene.onEnter();
                this.curScene = scene;
            }
            onResize (width, height) {
                this.size(width, height);
                
                if(this.curScene){
                    if(this.curScene.onResize){
                        this.curScene.onResize(width, height);
                    }else{
                        this.curScene.size(width, height);
                    }
                }
            }
        }

        Sail.class(SceneManager, "Sail.SceneManager");
    }
}