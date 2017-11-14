{
    const app = window.app;
    const spinUI = window.spinUI;

    class SpinViewUI extends spinUI {
        constructor() {
            super();

            this.sceneName = 'spinScene';
            this.init();

        }

        init() {

            this.initConfig();
            this.initDom();

            // 上下灯亮起的循环执行的函数（不能共用）
            this.initHandleLightManage();

            // 注册
            this.registerAction();

            // 重置
            this.reset();
        }

        // 注册
        registerAction() {

            // 进入房间
            app.messageCenter.registerAction("spin", (data) => {

                if (data.code !== 0) {

                    app.utils.warn(data.msg);
                    return;
                }

                // spin灯
                this.renderLight(data.spin);

                // 拉吧存储灯
                data.pull.lamp && app.room_ui_box.renderSaveLight(data.pull.lamp);

                // laba遮罩状态存储
                app.room_ui_box.saveLabaCoverStatus(data.pull.status);

            });

            // 挂载spin上下的动效处理
            app.observer.subscribe('spinPlay', this.spinPlay.bind(this));

        }

        initConfig() {
            this.config = {
                MIN_X: 60,
                MAX_X: 570
            };

            // 上一排灯的配置
            this.upConfig = {
                isGoing: false, //是否处于动画状态
                index: 0, //当前需要处理灯的索引
                changeState: 1, //当前灯需要更改到的状态（如1：该灯应该亮）
                leftToRight: true, //从左到右
                count: 0 //计数器（）
            };

            // 下一排灯的配置
            this.downConfig = {
                isGoing: false, //是否处于动画状态
                index: 0,
                changeState: 1,
                leftToRight: true,
                count: 0
            };
        }

        initDom() {
            // 初始x坐标
            let currentScene = app.sceneManager.currentScene;

            this.x = currentScene.width / 2 - this.width / 2;
            this.y = currentScene.spin_box.y;
            this.zOrder = 1;

            // 上排小灯
            this.up_list = this.up.findType('Clip');
            // 下排小灯
            this.down_list = this.down.findType('Clip');
        }

        // spin字闪动
        spinPlay() {
            this.dom_spin.autoPlay = true;

            Laya.timer.clear(this, this.spinStop);
            Laya.timer.once(2200, this, this.spinStop);

        }

        // spin停止闪动
        spinStop() {
            this.dom_spin.autoPlay = false;
            this.dom_spin.index = 0;
        }

        // 渲染灯（上面几盏， 下面几盏）
        renderLight(spin) {

            if ('lampUp' in spin) {
                this._renderLight('up', Number(spin.lampUp));
            }

            if ('lampDown' in spin) {
                this._renderLight('down', Number(spin.lampDown));
            }

        }

        // 渲染
        _renderLight(which, lamp) {
            // 动画激活中 && 灯不为0
            if(this[which + 'Config'].isGoing && lamp !== 0){

                return;
            }

            // 动画未激活中，则渲染几盏灯
            if(!this[which + 'Config'].isGoing){
                this[which + '_list'].forEach((item, index) => {
                    item.index = index < lamp ? 1 : 0;

                });
            }

            // 满格动效
            if (lamp === 12) {
                this.animationMoving(which);
            } else if(lamp === 0){
                this.clearAnimation(which, lamp);
            }
        }

        // 重置
        reset() {
            // 灭掉所有灯
            [...this.up_list, ...this.down_list].forEach((item, index) => {
                item.index = 0;
            });

        }

        // 一排灯跑动动画
        animationMoving(which) {
            this[which + 'Config'].isGoing = true;
            Laya.timer.loop(36, this, this[which + 'handleLightManage']);

        }

        // 清除动画
        clearAnimation(which, lamp) {
            Laya.timer.clear(this, this[which + 'handleLightManage']);
            this[which + '_list'].forEach((item, index) => {
                item.index = index < lamp ? 1 : 0;
            })

            let _config = this[which + 'Config'];
            // 重置
            _config.isGoing = false;
            _config.index = 0;
            _config.changeState = 1;
            _config.leftToRight = true;
            _config.count = 0;
        }

        // 初始化上下灯的控制
        initHandleLightManage() {

            // 上排灯需要循环执行
            this.uphandleLightManage = this._handleLightManage.bind(this, 'up');

            // 下排灯需要循环执行
            this.downhandleLightManage = this._handleLightManage.bind(this, 'down');

        }

        // 控制下一个灯的处理
        _handleLightManage(which) {
            let _list = this[which + '_list'];
            let _config = this[which + 'Config'];
            if (_config.count++ >= 24) {
                _config.leftToRight = !_config.leftToRight;
                _config.count = 1;
                _config.index = _config.leftToRight ? 0 : 11;
                _config.changeState = 1;
            }

            // 是 从左到右
            if (_config.leftToRight) {
                if (_config.index === 12) {
                    _config.changeState = 0;
                    _config.index = 0;
                }

                _list[_config.index++].index = _config.changeState;

                // 否 从右到左
            } else {
                if (_config.index === -1) {
                    _config.changeState = 0;
                    _config.index = 11;
                }

                _list[_config.index--].index = _config.changeState;
            }
        }

        // 重新载入
        reLoad(spin) {

            this.reset();

            // 渲染spin灯
            this.renderLight(spin);

            this.show();
        }

        show() {
            this.visible = true;
        }

        hide() {
            this.visible = false;
        }


    }

    app.SpinViewUI = SpinViewUI;

}
