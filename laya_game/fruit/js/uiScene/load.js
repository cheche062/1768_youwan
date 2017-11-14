// loading页
{
    const app = window.app;

    let commonFunction = {
        myPromise(obj, parame, ease, time) {
            return new Promise((resolve, reject) => {
                Laya.Tween.to(obj, parame, time, Laya.Ease[ease], Laya.Handler.create(this, resolve));

            });
        },

        // 水果动画
        animateFruit() {
            let fruitArr = this.fruitArr;
            let _initY = this.config.initY;

            _initY.forEach((item, index) => {
                fruitArr[index].rotation = 0;
                Laya.timer.once(index * 200, this, () => {
                    this.myPromise(fruitArr[index], { y: item - 50 }, 'linear', 240)
                        .then(() => {
                            return this.myPromise(fruitArr[index], { y: item }, 'linear', 240);
                        })
                        .then(() => {
                            return this.myPromise(fruitArr[index], { rotation: 360 }, 'bounceOut', 800);
                        })
                });
            })
        },

        // 动画启动
        fruitGo() {
            this.animateFruit();
            Laya.timer.loop(3000, this, this.animateFruit);
        },

        // 清除水果动画
        clearAnimateFruit() {
            Laya.timer.clear(this, this.animateFruit);

        }
    }


    class FruitLoadingUIDialog extends window.fruitLoadingUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initDom();
            this.initFruitY();
            this.registerAction();

            // 扩展方法
            Object.assign(this, commonFunction);

        }

        // 注册
        registerAction() {

            // 弹层出现
            app.observer.subscribe('fruitLoadingShow', this.myShow.bind(this));

            // 弹层消失
            app.observer.subscribe('fruitLoadingClose', this.myClose.bind(this));

        }

        initDom() {

            // 水果元素数组
            this.fruitArr = this.fruit_box.findType('Image');

            // 最上层（压过spin）
            this.zOrder = 2;

        }

        initFruitY() {
            this.config = {
                initY: [],
                timeOut: 30 * 1000 //请求超时时间
            };

            this.fruitArr.forEach((item, index) => {
                this.config.initY.push(item.y);
            })
        }

        // 刷新页面的提示
        reloadGame() {

            // 断开socket
            app.messageCenter.disconnectSocket();

            // 提示弹层
            app.observer.publish('commonPopShow', '请求超时，请刷新页面！', true, () => {
                window.location.reload();
            });
        }

        myShow() {
            // 定时器开启
            Laya.timer.once(this.config.timeOut, this, this.reloadGame); 
            this.fruitGo();
            this.visible = true;
            this.x = app.gameConfig.viewLeft;

            Laya.stage.addChild(this);
        }

        myClose() {
            // 清除定时器
            Laya.timer.clear(this, this.reloadGame); 
            this.clearAnimateFruit();
            this.visible = false;
            Laya.stage.removeChild(this);
        }



    }


    class LoadingScene extends window.loadingUI {
        constructor() {
            super();

            this.sceneName = "loadingScene";
            this.init();
        }

        //初始化
        init() {

            this.initDom();

            this.initConfig();
            // 添加遮罩
            this.addMask();

            // 初始y坐标
            this.initFruitY();

            // 扩展方法
            Object.assign(this, commonFunction);

            //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
            app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
        }

        onEnter() {

            app.utils.log(this.sceneName + " enter");

            // 水果动画启动
            this.fruitGo();

            //取消订阅时不用传递回调函数
            app.observer.unsubscribe(this.sceneName + "_enter");

        }

        initDom() {

            // 加载条
            this.load_content = this.load_box.getChildByName('load_content');

            this.fruitArr = this.fruit_box.findType('Image');

        }

        // 初始水果的y坐标
        initFruitY() {
            this.fruitArr.forEach((item, index) => {
                this.config.initY.push(item.y);
            })
        }

        initConfig() {
            this.config = {
                maskH: this.load_content.displayHeight,
                maskW: this.load_content.displayWidth,
                initY: [] //小水果的初始y坐标集合
            }
        }

        addMask() {
            let _load = this.load_content;
            _load.mask = new Laya.Sprite();

            this.loading(0);
        }

        // 加载运动条
        loading(percent) {
            let w = this.config.maskW * percent;
            let _load = this.load_content;
            _load.mask.graphics.clear();
            _load.mask.graphics.drawRect(0, 0, w, this.config.maskH, '#000000');
        }

        // 退出场景
        onExit() {
            app.utils.log(this.sceneName + " exit");

            // 清除动画
            this.clearAnimateFruit();

            //发布退出事件
            app.observer.publish(this.sceneName + "_exit");

            this.clear();
        }

        //自定义方法，场景退出的时候是销毁还是removeself请自行抉择
        clear() {
            this.destroy(true);
        }



    }

    app.LoadingScene = LoadingScene;
    app.FruitLoadingUIDialog = FruitLoadingUIDialog;

}
