var app = window.app;
var cdnpath = window.cdnpath;
var websocketurl = window.websocketurl;
var publicKey = window.publicKey;

//游戏基础模块
(function(){

    //场景管理器
    app.sceneManager = null;
    //顶层观察者，各模块间可以通过观察者来通信
    app.observer = null;
    //io模块
    app.messageCenter = null;

    //初始化
    app.init = function(){
        this.layaInit();
            this.moduleInit();
    }

    //游戏引擎初始化
    app.layaInit = function(){
        //配置宽高以及启用webgl(如果浏览器支持的话)
        Laya.init(app.config.gameWidth,app.config.gameHeight,Laya.WebGL);
        //是否开启FPS监听
        app.config.debug && Laya.Stat.show(0,0);
        //设置适配模式
        Laya.stage.scaleMode = app.config.scaleMode;
        //设置横屏
        Laya.stage.screenMode = app.config.screenMode;
        //设置水平对齐
		Laya.stage.alignH = app.config.alignH;
		//设置垂直对齐
		Laya.stage.alignV = app.config.alignV;

        //设置basepath
        Laya.URL.basePath = typeof cdnpath === "string" ? cdnpath : "";
    };

    //基础模块初始化
    app.moduleInit = function(){
        app.sceneManager = new app.sceneManagerModule();
        app.observer = new app.observerModule();
        app.messageCenter = new app.messageCenterModule({
            websocketurl : websocketurl,
            lib : typeof window.Primus === "undefined" ? "socketio" : "primus",//io就是socketio的namespace
            publicKey : typeof publicKey === "undefined" ? "" : publicKey
        });
    }

    app.run = function(){
        app.sceneManager.loadScene(new app.hallScene());
    }

    // test1768
})();

app.scaleMode

app.init();
app.run();