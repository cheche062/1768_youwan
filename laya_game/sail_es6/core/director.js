{
    let EVENT_RESIZE = Laya.Event.RESIZE;

    class Director extends Laya.Box {
        constructor (dialogtype) {
            super();

            this.dialog = null;
            this.scene = null;

            this.init(dialogtype);
        }
        destroy () {
            super.destroy.call(this, true);

            this.dialog = null;
            this.scene = null;
        }

        init (dialogtype) {
            this.size(Laya.stage.width, Laya.stage.height);

            this.dialog = new Sail.DialogManager(dialogtype);
            this.scene = new Sail.SceneManager();

            Laya.Dialog.manager = this.dialog;

            this.addChildren(this.scene, this.dialog);

            Laya.stage.on(EVENT_RESIZE, this, function () {
                this.onResize(Laya.stage.width, Laya.stage.height);
            });
            Laya.stage.event(EVENT_RESIZE);
        }

        runScene (scene) {
            this.scene.run(scene);
        }
        popScene (dialog, config) {
            this.dialog.open(dialog, config);
        }
        getRunningScene () {
            return this.scene.curScene;
        }
        closeAll () {
            this.dialog.closeAll();
        }
        closeByName (name) {
            this.dialog.closeByName(name);
        }
        closeByGroup (group) {
            this.dialog.closeByGroup(group);
        }
        getDialogsByGroup (group) {
            return this.dialog.getDialogsByGroup(group);
        }
        onResize (width, height) {
            this.size(width, height);

            this.dialog.onResize(width, height);
            this.scene.onResize(width, height);
        }
    }
    Sail.class(Director, "Sail.Director");
}