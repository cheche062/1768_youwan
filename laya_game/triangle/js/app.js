//游戏基础模块
{
    const app = window.app;
    //场景管理器
    app.sceneManager = null;
    //顶层观察者，各模块间可以通过观察者来通信
    app.observer = null;
    //io模块
    app.messageCenter = null;
    // gameConfig关于游戏部分配置
    app.gameConfig = {
        count: 0,
        isLogin: false //是否登录
    };

    // app添加方法
    Object.assign(app, {

        init() {
            this.initDebug();

            this.layaInit();
            // 模块初始化
            this.moduleInit();

            // loading页优先
            this.loadingPageShow();

        },

        initDebug() {
            this.config.debug = app.utils.initDebug('debugFE', '1');

            window.onerror = function(e) {
                let reload = () => { window.location.reload() };
                let text = '长时间离开，已断开连接，确定后重试'
                // 断开socket
                app.messageCenter.disconnectSocket();

                // 提示弹层
                app.observer.publish('commonPopShow', text, reload, reload);

                if (app.utils.initDebug('error', '1')) {
                    alert(e)
                }
            }

            this.config.localStatus = !app.utils.initDebug('act', 'game_triangle');
        },

        layaInit() {
            let config = this.config;
            //配置宽高以及启用webgl(如果浏览器支持的话)
            Laya.init(config.gameWidth, config.gameHeight, Laya.WebGL);

            //是否开启FPS监听
            if (app.utils.initDebug('stat', '1')) {
                Laya.Stat.show(0, 0);
            }

            //设置适配模式
            Laya.stage.scaleMode = config.scaleMode;
            //设置横屏
            Laya.stage.screenMode = config.screenMode;
            //设置水平对齐
            Laya.stage.alignH = config.alignH;
            //设置垂直对齐
            Laya.stage.alignV = config.alignV;
            //设置basepath
            Laya.URL.basePath = typeof window.cdnpath === "string" ? window.cdnpath : "";
            //版本号
            Laya.URL.version = config.GAME_VERSION;

        },

        moduleInit() {
            // 初始化声音
            this.audio = new this.AudioMudule();

            let param = {};
            // 非本地
            if (!app.config.localStatus) {
                param = {
                    websocketurl: window.websocketurl,
                    lib: typeof window.Primus === "undefined" ? "socketio" : "primus", //io就是socketio的namespace
                    publicKey: typeof window.publicKey === "undefined" ? "" : window.publicKey,
                    token: window.token,
                    ajaxUrl: {
                        day: '/?act=game_superstars&st=get_bet_rank&type=day',
                        week: '/?act=game_superstars&st=get_bet_rank&type=week',
                        month: '/?act=game_superstars&st=get_bet_rank&type=month',
                        userAccount: `/?act=game_gamebase&st=queryUserAccount&data=*&gameId=${gameId}&type=1`
                    }
                }

                // 初始化声音资源
                this.audio.initResource();
            }

            // 通信
            this.messageCenter = new window.messageCenterModule(param);

            // 测试用
            window.checheEmit = this.messageCenter.emit.bind(this.messageCenter);

            // 场景切换
            this.sceneManager = new window.sceneManagerModule();
            // 场景切换的观察者
            this.observer = new window.observerModule();

        },

        // 加载字体&&图片
        loadFontAndImage() {
            let count = 0;
            let length = this.config.RESOURCE.fonts.length;
            //全局字体资源
            this.config.RESOURCE.fonts.forEach((item, i, arr) => {
                let bitmapfont = new Laya.BitmapFont();
                bitmapfont.loadFont(item.url, Laya.Handler.create(this, () => {
                    Laya.Text.registerBitmapFont(item.name, bitmapfont);

                    // 字体全部加载完成
                    if (++count === length) {
                        // 加载图片
                        this.loadImages();
                    }
                }));
            })
        },

        // 加载图片
        loadImages() {
            Laya.loader.load(this.config.RESOURCE.disLoadingRes, Laya.Handler.create(this, this.onLoaded), Laya.Handler.create(this.loading_ui_view, this.loading_ui_view.loading, null, false));

        },

        // load
        loadingPageShow() {
            Laya.loader.load(this.config.RESOURCE.loadingRes, Laya.Handler.create(this, () => {

                // loading场景
                this.loading_ui_view = new this.LoadingScene();
                this.sceneManager.loadScene(this.loading_ui_view);

                // 浏览器窗口大小变化
                this.addResizeHandler();

                // 加载字体&&图片
                this.loadFontAndImage();

            }));

        },

        // 浏览器窗口大小变化
        addResizeHandler() {

            Laya.stage.on(Laya.Event.RESIZE, this, this.setViewCenter);

        },

        onLoaded() {
            console.warn('大厅&房间————资源加载完成');

            // 初始化所有弹层
            this.initAllPop();

            // 首先挂载好消息处理函数
            this.initGame();

            // 是否是本地
            if (app.config.localStatus) {
                this.enterRoom(true);

            } else {
                // 连接服务器
                this.messageCenter.connectSocket();
            }

        },

        // 初始化游戏
        initGame() {

            //一切请求等待首次连接后在发出 
            app.messageCenter.registerAction("conn::init", () => {
                // 进房间
                this.enterRoom(true);

            });

            // 错误信息处理
            app.messageCenter.registerAction('conn::error', (data) => {
                this.connError(data);

            });

        },

        // 进房间
        enterRoom(isLogin) {
            this.gameConfig.isLogin = isLogin;

            // 直接进房间
            app.room_ui_view = new app.RoomScene();
            app.sceneManager.loadScene(app.room_ui_view);

        },

        // 初始化所有弹层
        initAllPop() {
            // 键盘
            app.keyBoardNumber_ui_pop = new window.Tools.KeyBoardNumber();

            // 惊喜奖
            new app.SurprisePopUIView();

            // 普通弹层
            new app.CommonPopUIDialog();

            // 赢弹层
            new app.BigPrizePopUIView();

            // 帮助弹层
            new app.HelpPopUIDialog();

            //充值弹框 
            new app.Rechargepopup();

            //排行榜弹框 
            new app.RankList();

        },

        // 错误信息处理
        connError(data) {
            switch (Number(data.code)) {
                // 异地登陆
                case 1003:
                    let reload = () => { window.location.reload() };

                    // 断开socket
                    app.messageCenter.disconnectSocket();

                    // 提示弹层
                    app.observer.publish('commonPopShow', '异地登录，请刷新页面', reload, reload);

                    break;
            }

        },

        // 设置视图居中
        setViewCenter() {
            let _height = Laya.stage.height;
            let currentView = app.sceneManager.currentScene;
            currentView.height = _height;
        }

    })

    app.init();
}
