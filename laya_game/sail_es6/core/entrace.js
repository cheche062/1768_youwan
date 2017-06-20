{
    var utils = Sail.Utils;

    Sail.run = function (Config) {
        if(Sail.__isInit){return;}
        Sail.__isInit = true;

        Laya.init(Config.WIDTH, Config.HEIGHT, Laya.WebGL);

        Laya.stage.screenMode = Config.SCREEN_MODE;
        Laya.stage.scaleMode = Config.SCALE_MODE;
        Laya.URL.basePath = Config.BASE_PATH;

        if(utils.getUrlParam("debug_status") != "1"){
            console && (console.log = console.trace = console.error = console.warn = function () {});
        }

        Sail.viewer = new Sail.Viewer();
        Sail.io = new Sail.IO();
        Sail.director = new Sail.Director(Config.DIALOGTYPE);
        Sail.ASSETS_VERSION = Config.VERSION;
        Laya.stage.addChild(Sail.director);

        Sail.onStart && Sail.onStart();
    }
}