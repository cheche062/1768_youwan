// 房间
{
    const app = window.app;
    const roomUI = window.roomUI;
    const GM = window.GM;
    class RoomScene extends roomUI {
        constructor() {
            super();

            this.sceneName = 'roomScene';
            this.init();
        }

        init() {
            // 配置参数
            this.initDom();
            this.initAnimate();
            this.initConfig();
            this.initEvent();

            // 两只按钮准备
            this.buttonPrepare();

            //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
            app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
        }

        onEnter() {
            app.utils.log(this.sceneName + " enter");

            //取消订阅时不用传递回调函数
            app.observer.unsubscribe(this.sceneName + "_enter");

            // 头部初始化
            this.header_ui_box = new app.HeaderScene(this.top_box);

            // 注册
            this.registerAction();

            // 触发
            this.dispatchAction();

            // 开启变换小手
            this.startChangeFinger();

            // 登录在触发
            if (this.config.isLogin) {
                // 头部触发
                this.header_ui_box.dispatchAction();
            }

            // 公告
            this.noticeSystem();

            // 开启随机渲染问号
            this.startRandomWenhao();

        }

        // 注册
        registerAction() {
            app.messageCenter
                .registerAction("initGame", this.initGameRoomInfo.bind(this)) // 初始化游戏信息
                .registerAction("bet", this.resultCome.bind(this)) //结果过来了
                .registerAction("pool", this.renderPool.bind(this)) // 渲染福袋奖池总金额
                .registerAction("treasure", this.treasureHandler.bind(this)) // 福袋中奖

            app.observer
                .subscribe('updateDomInput', this.updateDomInput.bind(this)) //更新投币金额
                .subscribe('errorHandler', this.errorHandler.bind(this)) //错误处理
        }

        // 取消注册
        unRegisterAction() {
            // 取消订阅盈利榜金额更新
            // app.observer.unsubscribe('upDatePool');

            // app.messageCenter.unRegisterAction('initGame')

        }

        // 触发
        dispatchAction() {
            // 初始化游戏
            app.messageCenter.emit('initGame');
        }

        // 配置参数
        initConfig() {
            // 全体左移4px
            this.starArr.forEach((item, index) => {
                item.x = item.x - 4;
            })
            let _disX = this.starArr[0].x - this.dom_star_light.x;
            let _disY = this.starArr[0].y - this.dom_star_light.y;

            let starLightPosArr = this.starArr.map((item, index) => {
                return { x: item.x - _disX, y: item.y - _disY };
            })

            this.config = {
                btnType: '', // 当前选择的按钮颜色 
                isPlayOuterCount: 0, // 是否播放外圈声音
                fastCount: 0, // 预备加速
                slowDown: false, //减速状态
                handPosArr: [{ x: 694, y: 1127 }, { x: 492, y: 1203 }], //小手坐标数组
                handIndex: 0, //当前小手的位置
                fudaiCallBack: null, //福袋中奖
                isDropKey: false, //当局是否中得钥匙
                wenhaoMark: [3, 5, 6, 10, 20, 30, 50, 'key'], // ?号对应的倍率 
                totalKeys: 0, // 钥匙总数
                currentAmount: 0, // 当次中奖金额
                winTotalAmount: 0, // 总共赢得金额
                isGameGoing: false, //游戏是否正在进行
                isTIMEOUT: false, //请求超时
                isLogin: app.utils.checkLoginStatus(), //是否登录
                MIN_TIMES: 60, // 星星跳转的最少次数 
                MAX_TIMES: 120, // 星星跳转的最多次数 
                MIN_INPUT: 100,
                MAX_INPUT: 500000,
                user_input_text: 100, //投币金额
                starLightPosArr, //高亮星星pos的数组
                rotationAngle: { //外环对应角度
                    "*0": [0, -60, -120, -180, -240, -300],
                    "*8": -30,
                    "*2": [-90, -270],
                    "*4": -210,
                    "?": [-150, -330]
                },
                innerBaseArray: [1.2, 1.5, 2, 1.2, 1.5, 2, 1.2, 1.5, 2, 1.2, 1.5, 2], // 内圈索引对应的倍率
                currentStarIndex: 0, // 高亮星星当前的位置索引
                isStartStoped: true, // 高亮星星是否停止
                innerResultIndex: -1, // 内环的结果位置索引
                innerResultIndexNew: -1, // 内环对应的倍率
                outerResultBase: -1, //外环的结果倍率
                outerResultBaseNew: -1 //外环的结果倍率(真实的)
            }
        }

        // 初始化dom
        initDom() {

            // 美女
            this.dom_girl = this.middle_box.getChildAt(0);
            // 排行榜按钮
            this.dom_btn_rank = this.middle_box.getChildByName('btn_rank');
            // 公告按钮
            this.dom_btn_notice = this.middle_box.getChildByName('btn_notice');
            this.dom_redPoint = this.middle_box.getChildByName('dom_redPoint');

            // 高亮的星星
            this.dom_star_light = this.middle_box.getChildByName('star_light');
            this.dom_star_light.visible = false;
            this.dom_star_ladder = this.middle_box.getChildByName('star_ladder');
            // 火花
            this.dom_fire_animate = this.middle_box.getChildByName('dom_fire_animate');

            // 所有的星星数组
            this.starArr = this.star_box.findType('Image');

            // 开始按钮
            this.start_yellow_box = this.bottom_box.getChildByName('start_yellow_box');
            this.start_yellow_btn = this.start_yellow_box.getChildAt(0);
            this.start_blue_box = this.bottom_box.getChildByName('start_blue_box');
            this.start_blue_btn = this.start_blue_box.getChildAt(0);

            // 充值按钮
            this.dom_btn_recharge = this.bottom_box.getChildByName('btn_recharge');
            // 减法
            this.dom_btn_sub = this.bottom_box.getChildByName('btn_sub');
            // 加法
            this.dom_btn_add = this.bottom_box.getChildByName('btn_add');
            // 最大
            this.dom_btn_max = this.bottom_box.getChildByName('btn_max');
            // 输入框box
            this.input_box = this.bottom_box.getChildByName('input_box');
            // 输入文本
            this.dom_input = this.input_box.getChildByName('dom_input');
            // 小手
            this.dom_finger = this.bottom_box.getChildByName('dom_finger');

            // 福袋相关
            this.dom_fudai_all = this.fudai_box.getChildByName('fudai_all');
            // 小魔法棒
            this.dom_magic = this.fudai_box.getChildByName('dom_magic');
            // 大魔法棒
            this.dom_magic_big = this.fudai_box.getChildByName('dom_magic_big');
            this.dom_magic_big.visible = false;
            this.dom_magic_big.stop();

            // 当局赢得金额
            this.dom_fudai_win = this.fudai_box.getChildByName('fudai_win');
            // 总钥匙数
            this.dom_bang_num = this.fudai_box.getChildByName('bang_num');

            // ？元素
            this.dom_wenhao_list = this.rotation_box.find('wenhao', true);

            // 三格扫光
            this.dom_three_light = this.middle_box.getChildByName('dom_three_light');
            this.dom_three_light.visible = false;

        }

        // 初始化动画
        initAnimate() {
            // 开始前的光效
            this.dom_light_start.stop();
            this.dom_small_light.play('wait', true);
            this.dom_magic.play('wait', true);

            // 火花
            this.setFireVisible(false);

            // 中奖梯形
            this.dom_star_ladder.stop();
            this.dom_star_ladder.visible = false;

            // 初始化都为‘？’
            // this.renderWenhao('?', '?');

        }

        // 事件初始化
        initEvent() {

            // 开始
            this.start_yellow_box.on(Laya.Event.CLICK, this, this.emitStartGame.bind(this, 'y'));
            this.start_blue_box.on(Laya.Event.CLICK, this, this.emitStartGame.bind(this, 'b'));

            // 键盘出现
            this.input_box.on(Laya.Event.CLICK, this, this.showKeyBoardNumber);

            // 减法加法按钮
            this.dom_btn_sub.on(Laya.Event.CLICK, this, this.addSubHandler.bind(this, 'sub'));
            this.dom_btn_add.on(Laya.Event.CLICK, this, this.addSubHandler.bind(this, 'add'));
            // max
            this.dom_btn_max.on(Laya.Event.CLICK, this, this.maxHandler);


            // 充值弹层
            this.dom_btn_recharge.on(Laya.Event.CLICK, this, () => {
                app.observer.publish("rechargePopShow");
                app.audio.play('click');

            });

            // 排行榜
            this.dom_btn_rank.on(Laya.Event.CLICK, this, () => {
                app.observer.publish("rankPopShow");
                app.audio.play('click');
            });

            this.dom_girl.on(Laya.Event.CLICK, this, () => {
                app.audio.play('girl');
            });

            // 开启小手倒计时
            Laya.stage.on(Laya.Event.CLICK, this, () => {
                Laya.timer.once(2 * 60 * 1000, this, this.startChangeFinger);
            });

        }

        // 大魔法棒动画
        bigMagicAnimate() {
            // 不中钥匙
            if (!this.config.isDropKey) {
                return;
            }

            this.dom_magic_big.once(Laya.Event.STOPPED, this, () => {
                // 钥匙总数目
                this.dom_bang_num.text = this.config.totalKeys + '/10';

                this.dom_magic_big.visible = false;

                // 福袋中奖
                this.config.fudaiCallBack && this.config.fudaiCallBack();
                this.config.fudaiCallBack = null;
            });

            this.dom_magic_big.visible = true;
            this.dom_magic_big.play('start', false);
        }

        // 福袋中奖
        treasureHandler(data){
            this.config.fudaiCallBack = ()=>{
                // 更新钥匙数量
                app.observer.publish('fudaiPopShow', data, this.updateKeyNum.bind(this));
            }

        }

        // 两只按钮准备
        buttonPrepare() {
            this.start_yellow_btn.play('yellow_wait', true);
            this.start_blue_btn.play('blue_wait', true);
        }

        // 初始化信息
        initGameRoomInfo(data) {
            if (Number(data.code) !== 0) {
                return;
            }

            this.dom_fudai_all.text = data.treasurePool;

            // 钥匙数目
            this.updateKeyNum(data.totalKeys);

        }

        // 发送开始游戏
        emitStartGame(type) {
            // 防止用户重复点击
            if (this.config.isGameGoing) {
                app.utils.log('游戏正在进行。。。');
                return;
            }

            // 关闭小手
            this.endchangeFinger();
            app.audio.play('click');

            // 未登录
            if (!this.config.isLogin) {
                app.utils.gotoLogin();
                return;
            }

            if(!this.dom_star_light.visible){
                this.dom_star_light.visible = true;
            }

            // 开启随机渲染问号
            Laya.timer.clear(this, this.startRandomWenhao);
            this.startRandomWenhao();

            this.config.isGameGoing = true;

            // 发送投币
            app.messageCenter.emit('bet', {
                amount: this.config.user_input_text,
                color: type,
                restPoint: this.header_ui_box.config.yuNum,
                tpoint: this.header_ui_box.config.tingDou
            });
            this.config.btnType = type; //按钮颜色

            let key = type === 'y' ? 'yellow' : 'blue';
            let otherKey = type === 'y' ? 'blue' : 'yellow';
            let dom_btn = this['start_' + key + '_btn'];
            let dom_btn_other = this['start_' + otherKey + '_btn'];
            dom_btn.once(Laya.Event.STOPPED, this, () => {
                dom_btn.play(key + '_wait', true);
            });

            dom_btn.play(key + '_press', false);

            // 另一只禁用状态
            dom_btn_other.play('disable', true);

            // 开始光效
            this.dom_light_start.play('start', false);

            // 游戏启动
            this.gameGo();

        }

        // 游戏启动
        gameGo() {
            // 游戏重置
            this.resetGame();
            this.starGo();
            this.outerRotationGo();

            // 开启火花
            this.setFireVisible(true);

        }

        // 游戏重置
        resetGame() {
            this.config.innerResultIndex = -1;
            this.config.innerResultIndexNew = -1;
            this.config.outerResultBase = -1;
            this.config.outerResultBaseNew = -1;
            this.config.isTIMEOUT = false;
            this.config.currentAmount = 0;
            this.config.isDropKey = false;

            this.config.isStartStoped = false;
            this.config.slowDown = false;
            this.config.fastCount = 0;

            // 打开三光
            this.dom_three_light.visible = true;

            // 当局赢重置为0
            this.dom_fudai_win.text = '0';
        }

        // 结果来了
        resultCome(data) {
            if (Number(data.code !== 0)) {

                // 错误处理
                this.errorHandler(data);
                return;
            }

            // 设置投币默认额cookie
            GM.CookieUtil.set("defaultBet"+GM.gameId+GM.user_id, String(this.config.user_input_text));  // val为押注额

            let mul = data.mul;
            let outKey = '*' + mul.out;

            // 内圈倍率
            this.config.innerResultIndex = Number(mul.in) === 12 ? 0 : mul.in;
            this.config.innerResultIndexNew = this.config.innerBaseArray[this.config.innerResultIndex];

            // 掉钥匙
            if (Number(data.isDropKey) === 1) {
                // 当局中得钥匙
                this.config.isDropKey = true;
                outKey = 'key';
            }

            this.config.outerResultBaseNew = outKey;
            // 外圈倍率
            if (!(outKey in this.config.rotationAngle)) {
                outKey = "?";
            }
            this.config.outerResultBase = outKey;

            // 总共赢得金额
            // this.config.winTotalAmount += Number(data.amount);

            // 总钥匙数目
            if ("totalKeys" in data) {
                this.config.totalKeys = data.totalKeys;
            }

            // 当次中奖金额
            this.config.currentAmount = Number(data.amount);

            // 更新用户余额
            this.header_ui_box.updateUserYuDou(-1 * this.config.user_input_text);

        }

        // 错误处理
        errorHandler(data) {
            let code = Number(data.code);

            // 请求超时 || 异常
            this.config.isTIMEOUT = true;
            this.starStop();

            // otp验证 
            if (code === 81) {
                app.utils.otpCheckHandler();

                return;
            }

            // 输分提醒
            if (data.code === 'losePoint') {

                return;
            }

            app.observer.publish('warmNoticePopShow', data.msg);

        }

        // 星星启动
        starGo() {
            this.changeStarPos();
            Laya.timer.loop(400, this, this.changeStarPos);
        }

        // 星星停止
        starStop() {
            Laya.timer.clear(this, this.changeStarPos);
            this.config.currentStarIndex = this.config.currentStarIndex % 12;
            this.config.isStartStoped = true;

            // 星星停止就快速闪动
            this.dom_star_light.play('fast', true);

            // 隐藏扫光
            this.dom_three_light.visible = false;

        }

        // 变换高亮星星的位置
        changeStarPos() {
            app.audio.play('innerStart');

            let _config = this.config;
            let _index = this.config.currentStarIndex++ % 12;
            let j = 5; //加速减速的标记
            _config.fastCount++;
            let pos = _config.starLightPosArr[_index];
            this.dom_star_light.pos(pos.x, pos.y);
            this.dom_three_light.rotation = _index * 30;

            // 开始变快
            if (_config.fastCount === j) {
                Laya.timer.loop(100, this, this.changeStarPos);
            }

            // 减速 || 停止
            if (_config.currentStarIndex > _config.MIN_TIMES && _config.innerResultIndex > -1) {

                // 到达当前结果索引位置 && 减速状态
                if (_config.slowDown && _index === _config.innerResultIndex) {
                    this.starStop();

                    return;
                }

                // 减速(开始减速的索引)
                let slowIndex = (_config.innerResultIndex - j) >= 0 ? _config.innerResultIndex - j : _config.innerResultIndex - j + 12;

                if (_index === slowIndex) {
                    _config.slowDown = true;
                    Laya.timer.loop(400, this, this.changeStarPos);
                }

            }

            // 请求超时
            if (_config.currentStarIndex >= _config.MAX_TIMES) {
                this.config.isTIMEOUT = true;
                this.starStop();
                app.observer.publish('warmNoticePopShow', '网络异常...')
            }

        }

        // 外圈转盘转动
        outerRotationGo() {
            let targetRotation = -360;
            let _config = this.config;
            let cb = this.outerRotationGoCallBack;
            let _randomNumber = app.utils.randomNumber;
            let _wenhaoMark = _config.wenhaoMark;
            let during = 1500;

            // 重置角度为0
            this.rotation_box.rotation = 0;

            // 内圈开始减速 && 有结果值
            if (this.config.slowDown && _config.outerResultBase in _config.rotationAngle) {
                let _value = _config.rotationAngle[_config.outerResultBase];

                // 停止随机渲染问号
                this.endRandomWenhao();

                // 如果是数组就得在里面随机一个位置出来
                if (Array.isArray(_value)) {
                    let _random = _randomNumber(_value.length - 1);
                    // 在已有的倍率数组里随机取一个位置
                    targetRotation = _value[_random];

                    // 说明是？后台配置中奖
                    if (_config.outerResultBase === '?') {
                        let _num = _wenhaoMark[_randomNumber(_wenhaoMark.length - 1)];
                        if (_random === 0) {
                            this.renderWenhao(_config.outerResultBaseNew, _num);
                        } else {
                            this.renderWenhao(_num, _config.outerResultBaseNew);
                        }
                        // 给？号随机配值
                    } else {
                        this.renderWenhao(_wenhaoMark[_randomNumber(_wenhaoMark.length - 1)], _wenhaoMark[_randomNumber(_wenhaoMark.length - 1)]);
                    }

                    // 非数组直接就是那个位置
                } else {
                    targetRotation = _value;
                }

                // 计算角度
                targetRotation = targetRotation - (360 - _config.innerResultIndex * 30);
                // 将角度限制在-360以内
                targetRotation = targetRotation < -360 ? targetRotation + 360 : targetRotation;
                // during = Math.abs(Math.floor(targetRotation / 120)) * 800;
                during = 2000;

                // 游戏停止
                cb = this.gameStop.bind(this, false);
            }

            // 请求超时 || 异常
            if (this.config.isTIMEOUT) {
                // 停止随机渲染问号
                this.endRandomWenhao();

                // 游戏停止
                cb = this.gameStop.bind(this, true);
            }

            // 隔一次播放外圈声音
            if (this.config.isPlayOuterCount++ % 2 === 0) {
                app.audio.play('outerStart');
            }

            Laya.Tween.to(this.rotation_box, { rotation: targetRotation }, during, Laya.Ease.linearIn, Laya.Handler.create(this, cb));
        }

        //  转盘继续
        outerRotationGoCallBack() {
            this.outerRotationGo();
        }

        // 重置游戏停止
        _resetAfterGameOver() {

            // 恢复慢速闪动
            this.dom_star_light.play('slow', true);

            // 开始准备按钮
            this.buttonPrepare();

            this.config.isGameGoing = false;

            // 4秒后开启
            Laya.timer.once(4000, this, this.startRandomWenhao);

            app.utils.log('游戏停止。。。');

        }

        // 游戏停止
        gameStop(isTimeout) {
            let _config = this.config;

            // 火花隐藏
            this.setFireVisible(false);

            // 超时
            if (isTimeout) {
                // 重置游戏停止
                this._resetAfterGameOver();

                return;
            }

            /*  非超时(正常出结果)  */
            // 未中奖
            if (_config.currentAmount <= 0) {
                app.audio.play('lose');

                // 重置游戏停止
                this._resetAfterGameOver();

                // 未中奖执行救济金
                app.jiujijin();

                // 中奖
            } else {
                // 如果外圈是不中或掉钥匙
                if (_config.outerResultBaseNew === '*0' || _config.outerResultBaseNew === 'key') {
                    _config.outerResultBaseNew = '*1';
                }

                // 梯形出现
                this.dom_star_ladder.visible = true;
                this.dom_star_ladder.rotation = _config.innerResultIndex * 30;
                this.dom_star_ladder.play('result', true);

                let showResultFn = () => {
                    // 中奖音效
                    app.audio.play('win');

                    // 梯形消失
                    this.dom_star_ladder.visible = false;
                    this.dom_star_ladder.stop();

                    // 弹层关闭后的回调
                    let callback = () => {

                        // 更新用户余额
                        this.header_ui_box.updateUserYuDou(_config.currentAmount);

                        // 当局赢得金额
                        this.dom_fudai_win.text = _config.currentAmount;

                        // 播放模仿棒跳出动画
                        this.bigMagicAnimate();

                        // 重置游戏停止(防止弹层还未出现重复点击开始按钮)
                        this._resetAfterGameOver();

                        // 美女声音
                        Laya.timer.once(1000, this, () => { app.audio.play('girl') });
                    }

                    app.observer.publish('winPopShow', _config.outerResultBaseNew, '*' + _config.innerResultIndexNew, '+' + _config.currentAmount, _config.btnType, callback.bind(this));
                }

                // 延迟1000ms出现
                Laya.timer.once(1000, this, showResultFn);
            }


        }


        // 钥匙数目更新
        updateKeyNum(num) {
            this.dom_bang_num.text = num + '/10';
            this.dom_magic.play('start', true);
            Laya.timer.once(3000, this, () => { this.dom_magic.play('wait', true); });
            this.config.totalKeys = num;
        }

        // 渲染福袋奖池总金额
        renderPool(data) {
            this.dom_fudai_all.text = data.treasure;
        }

        // 开启随机
        startRandomWenhao() {
            Laya.timer.loop(1000, this, this.randomRenderWenhao);
        }

        // 关闭随机
        endRandomWenhao() {
            Laya.timer.clear(this, this.randomRenderWenhao);
        }

        // 随机渲染不定项倍率
        randomRenderWenhao() {
            let _randomNumber = app.utils.randomNumber;
            let _wenhaoMark = this.config.wenhaoMark;
            let len = _wenhaoMark.length - 1;
            let num1 = _wenhaoMark[_randomNumber(len)];
            let num2 = _wenhaoMark[_randomNumber(len)];

            this.renderWenhao(num1, num2);
        }

        // ？元素的内容渲染
        renderWenhao(str1, str2) {
            let item0 = this.dom_wenhao_list[0];
            let item1 = this.dom_wenhao_list[1];

            this._renderWenhao(item0, str1);
            this._renderWenhao(item1, str2);

        }

        // ？元素渲染
        _renderWenhao(obj, str) {
            if (str === 'key') {
                obj.getChildAt(0).visible = false;
                obj.getChildAt(0).text = '?';
                obj.getChildAt(1).visible = true;
            } else {
                obj.getChildAt(0).visible = true;
                obj.getChildAt(0).text = String(str).charAt(0) === '*' ? str : '*' + str;
                obj.getChildAt(1).visible = false;
            }
        }

        // 火花
        setFireVisible(bool) {
            // 火花开启
            this.dom_fire_animate.visible = bool;

            if (bool) {
                this.dom_fire_animate.play('start', true);
            } else {
                this.dom_fire_animate.stop();
            }
        }

        // max最大值按钮
        maxHandler() {
            // 未登录
            if (!this.config.isLogin) {
                app.utils.gotoLogin();
                return;
            }

            // 游戏进行中
            if (this.config.isGameGoing) {
                return;
            }

            app.audio.play('click');

            let yuNum = this.header_ui_box.config.yuNum;
            let current = yuNum - yuNum % 100;
            current = current < this.config.MIN_INPUT ? this.config.MIN_INPUT : current;
            current = current > this.config.MAX_INPUT ? this.config.MAX_INPUT : current;

            this.updateDomInput(Number(current));
        }

        // 减法加法
        addSubHandler(type) {
            // 游戏进行中
            if (this.config.isGameGoing) {
                return
            }
            app.audio.play('click');

            let max = this.config.MAX_INPUT;
            let min = this.config.MIN_INPUT;
            let current = this.config.user_input_text;
            let base = 100;
            if (type === 'sub') {
                if (current <= 1000) {
                    base = -100;
                } else if (current > 1000 && current <= 10000) {
                    base = -1000;
                    if (current < 2000) {
                        base = -100;
                    }
                } else if (current > 10000 && current <= 100000) {
                    base = -10000;
                    if (current < 20000) {
                        base = -1000;
                    }
                } else if (current > 100000 && current <= 1000000) {
                    base = -100000;
                    if (current < 200000) {
                        base = -10000;
                    }
                }

            } else if (type === 'add') {
                if (current >= 1000 && current < 10000) {
                    base = 1000;
                } else if (current >= 10000 && current < 100000) {
                    base = 10000;
                } else if (current >= 100000) {
                    base = 100000;
                }
            }

            current += base;
            current = current > max ? max : current;
            current = current < min ? min : current;

            this.updateDomInput(Number(current));

        }

        // 修改投币金额
        updateDomInput(num) {
            this.dom_input.text = num;
            this.config.user_input_text = num;
        }

        // 键盘出现
        showKeyBoardNumber() {
            // 游戏进行中
            if (this.config.isGameGoing) {
                return
            }

            app.audio.play('click');

            // let txt = this.config.user_input_text;
            app.keyBoardNumber_ui_pop.enter('', {
                length: 6,
                close: this.hideKeyBoardNumber.bind(this),
                input: null
            });
        }

        // 隐藏键盘
        hideKeyBoardNumber(type, value) {
            let max = this.config.MAX_INPUT;
            let min = this.config.MIN_INPUT;
            if (type === "confirm") {
                let _value = Number(value);

                _value = _value > max ? max : _value;
                _value = _value < min ? min : _value;

                _value = _value - _value % min;

                this.updateDomInput(_value);
            }
        }

        // 系统公告
        noticeSystem() {
            if (window.GM && GM.isCall_out === 1 && GM.noticeStatus_out) {

                GM.noticeStatus_out(this.noticeCallBack.bind(this));
            }
        }

        // 关闭小手变换
        endchangeFinger() {
            this.dom_finger.visible = false;
            this.dom_finger.stop();
            Laya.timer.clear(this, this.changeFinger);
        }

        // 开启小手变换
        startChangeFinger() {
            this.dom_finger.visible = true;
            this.dom_finger.play('start', true);
            Laya.timer.loop(5 * 1000, this, this.changeFinger);

            // 每次开启后固定10秒关闭小手
            Laya.timer.once(10 * 1000, this, this.endchangeFinger);
        }

        // 变换小手
        changeFinger() {
            let posArr = this.config.handPosArr;

            this.config.handIndex = this.config.handIndex === 0 ? 1 : 0;
            this.dom_finger.pos(posArr[this.config.handIndex].x, posArr[this.config.handIndex].y);
        }

        noticeCallBack(data = {}) {
            // 是否显示系统公告
            if (!data.isShowNotice) {

                return;
            }

            // 是否需要显示小红点
            if (data.isShowRedPoint) {
                // 显示小红点
                this.dom_redPoint.visible = true;
            }

            this.dom_btn_notice.on(Laya.Event.CLICK, this, () => {
                // 直接隐藏小红点
                this.dom_redPoint.visible = false;
                GM.noticePopShow_out && GM.noticePopShow_out();

            });

            // 显示出公告按钮
            this.dom_btn_notice.visible = true;
        }

        // 异步优化
        myPromise(context, delay) {
            return new Promise((resolve, reject) => {
                Laya.timer.once(delay, context, resolve);
            })
        }


        onExit() {
            app.utils.log(this.sceneName + " exit");

            // 取消所有注册
            this.unRegisterAction();

            //发布退出事件
            app.observer.publish(this.sceneName + "_exit");

            this.clear();
        }

        //自定义方法，场景退出的时候是销毁还是removeself请自行抉择
        clear() {
            this.destroy(true);
        }

    }

    app.RoomScene = RoomScene;

}
