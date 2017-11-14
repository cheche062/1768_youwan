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
        viewLeft: 0, //视图位移
        ylbStatus: 1, //盈利榜是否关闭
        timeLimit: false, //时间限制
        baseCoin: 10 //游戏币基数
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

            // 5s内执行一次
            this.jiujijin = window._.throttle(this._jiujijin, 5000);

        },

        initDebug() {
            this.config.debug = app.utils.initDebug('debugFE', '1');
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

            // 点击阴影无法关闭弹层
            window.UIConfig.closeDialogOnSide = false;
        },

        moduleInit() {
            // 场景切换
            this.sceneManager = new window.sceneManagerModule();
            // 场景切换的观察者
            this.observer = new window.observerModule();
            // 通信
            this.messageCenter = new window.messageCenterModule({
                websocketurl: window.websocketurl,
                lib: typeof window.Primus === "undefined" ? "socketio" : "primus", //io就是socketio的namespace
                publicKey: typeof window.publicKey === "undefined" ? "" : window.publicKey,
                token: window.token
            })

            // 测试用
            window.checheEmit = this.messageCenter.emit.bind(this.messageCenter);
        },

        // 加载字体
        loadFont() {
            //全局字体资源
            this.config.RESOURCE.fonts.forEach((item, i, arr) => {
                let bitmapfont = new Laya.BitmapFont();
                bitmapfont.loadFont(item.url, Laya.Handler.create(this, () => {
                    Laya.Text.registerBitmapFont(item.name, bitmapfont);
                }));
            })
        },

        // 加载图片
        loadImages() {
            Laya.loader.load(this.config.RESOURCE.disLoadingRes, Laya.Handler.create(this, this.onLoaded), Laya.Handler.create(this, this.onLoading, null, false));
        },

        // loading条动画
        onLoading(percent) {
            // 当前场景是loading
            this.sceneManager.currentScene.loading(percent);
        },

        // load
        loadingPageShow() {
            Laya.loader.load(this.config.RESOURCE.loadingRes, Laya.Handler.create(this, () => {

                // loading场景
                this.sceneManager.loadScene(new this.LoadingScene());

                // 设置视图居中
                app.setViewCenter();

                // 浏览器窗口大小变化
                Laya.stage.on(Laya.Event.RESIZE, this, this.setViewCenter);

                // 加载字体
                this.loadFont();
                // 加载图片
                this.loadImages();

            }));

        },

        onLoaded() {
            console.warn('大厅&房间————资源加载完成');

            // 初始化所有弹层
            this.initAllPop();

            // 首先实例头部
            if (!app.header_ui_box) {
                app.header_ui_box = new app.HeaderScene();
            }

            //  判断是进大厅还是房间 (首先挂载好消息处理函数)
            this.initGame();

            // 连接服务器
            this.messageCenter.connectSocket();
        },

        // 初始化游戏
        initGame() {
            // 是否登录(未登录直接跳大厅)
            if (!app.utils.checkLoginStatus()) {

                this.enterHall();

                // 初始化声音
                app.audio.init();

                return;
            }

            //一切请求等待首次连接后在发出 
            app.messageCenter.registerAction("conn::init", () => {
                // 初始化游戏
                app.messageCenter.emit('initGame');

                // 头部的首次触发
                app.header_ui_box.dispatchAction();

                // 发送广告(仅仅一次)
                app.messageCenter.emit("advertise");

            });

            // 注册初始化游戏
            app.messageCenter.registerAction('enterRoom', (data) => {
                if (Object.keys(data.tableInfo).length === 0) {
                    this.enterHall();

                } else {
                    this.enterRoom(data);

                }

                // 初始化声音
                app.audio.init();
            });

            // 错误信息处理
            app.messageCenter.registerAction('conn::error', (data) => {
                this.connError(data);
            });


        },

        // 进入大厅
        enterHall() {

            app.hall_ui_box = new app.HallScene();

            // 加载页去掉
            app.observer.publish('fruitLoadingClose');

            // 大厅场景
            app.sceneManager.loadScene(app.hall_ui_box);

            // 设置视图居中
            app.setViewCenter();

        },

        // 进入房间
        enterRoom(data) {
            // 进入房间失败
            if (data.code !== 0) {
                // 加载页去掉
                app.observer.publish('fruitLoadingClose');

                if (data.code === 10) {

                    app.observer.publish('quit_rechargePopShow', 'less');

                } else {
                    // 错误信息
                    app.observer.publish('commonPopShow', data.msg);
                }

                return;
            }

            // 成功进房间
            this.enterRoomSuccess(data);
        },

        // 成功进房间
        enterRoomSuccess(data) {
            app.room_ui_box = new app.RoomScene();

            // 渲染房间信息
            app.room_ui_box.renderRoomInfo(data);

            // 加载页去掉
            app.observer.publish('fruitLoadingClose');

            // 房间场景
            app.sceneManager.loadScene(app.room_ui_box);

            // 设置视图居中
            app.setViewCenter();

            // 物理引擎初始化
            app.matterCenter.init(data.tableInfo.spin);
        },

        // 初始化所有弹层
        initAllPop() {
            // 充值弹层
            new app.RechargeUIDialog();

            // 公共提示弹层
            new app.CommonPopDialog();

            // 仅读的弹层
            new app.OnlyReadPopDialog();

            // 确认是否退出房间 && 金额不足是否去充值
            new app.Quit_rechargePopUIDialog();

            // 盈利榜中奖提示
            new app.GainPopUIDialog();

            // 盈利榜弹层
            new app.YinglibangPopUIView();

            // 玩家信息
            new app.PlayerInfoPopUIView();

            // 我的战绩
            new app.MyGradePopUIView();

            // 历史记录
            new app.HistoryPopUI();

            // 收获弹层
            new app.ShouhuoPopUIDialog();

            // 加载中
            new app.FruitLoadingUIDialog();

            // 小奖
            new app.SmallAwardPop();

            // 大奖
            new app.SuperAwardPop();

            // 帮助
            new app.HelpPopUIDialog();

            // 广告
            new app.AdvertisePopDialog();

            // 普通文本提示弹层
            new app.NormalPopDialog();

            // 新手引导
            new app.NewUserPopUIDialog();

        },

        // 错误信息处理
        connError(data) {
            switch (Number(data.code)) {
                // 异地登陆
                case 1003:

                    // 断开socket
                    app.messageCenter.disconnectSocket();

                    // 提示弹层
                    app.observer.publish('commonPopShow', '异地登录，请刷新页面', true, () => {
                        window.location.reload();
                    });

                    break;

            }

        },

        //救济金
        _jiujijin() {
            Laya.timer.once(5000, this, () => {
                if (window.GM && window.GM.socket_RJ && window.GM.socket_RJ.exec) {
                    // 延时确保服务器那边有了
                    window.GM.socket_RJ.exec();
                    // 更新余额
                    app.messageCenter.emit("userAccount");

                }
            })
        },

        // 设置视图居中
        setViewCenter() {
            let _width = Laya.stage.width;
            let currentView = app.sceneManager.currentScene;
            let _x = _width > 750 ? (_width - 750) / 2 : 0;

            currentView.x = _x;
            app.gameConfig.viewLeft = _x;

            // 位置
            if (app.matterCenter.matterView_ui_box) {
                app.matterCenter.matterView_ui_box.x = _x;

            }
        }



    })

    app.init();
}
