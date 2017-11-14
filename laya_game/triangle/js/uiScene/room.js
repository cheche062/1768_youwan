// 房间
{
    const app = window.app;
    const roomUI = window.roomUI;
    const GM = window.GM;
    const Sail = window.Sail;
    const { LOCAL_DATA } = app.data;
    class RoomScene extends roomUI {
        constructor() {
            super();

            this.sceneName = 'roomScene';
            this.init();
        }

        init() {
            this.initDom();

            // 配置参数
            this.initConfig();

            // 初始化三角
            this.initTriangle();

            // 初始化底部的赢提示
            this.initWinBottom();

            this.initEvent();

            this.fingerAnimate();

            //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
            app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
        }

        onEnter() {
            // 视图居中
            app.setViewCenter();

            app.utils.log(this.sceneName + " enter");

            //取消订阅时不用传递回调函数
            app.observer.unsubscribe(this.sceneName + "_enter");

            // 注册
            this.registerAction();

            // 线上
            if (!app.config.localStatus) {
                // 触发
                this.dispatchAction();

                // 初始化公共游戏模块
                this.initCommonGameModule();

                // 初始化声音状态
                app.audio.initSoundState(this.dom.btn_voice);

            } else {
                this.triangleDefaultHandler();
            }
        }

        // 注册
        registerAction() {
            app.messageCenter
                .registerAction("initGame", this.initGameRoomInfo.bind(this)) // 初始化游戏信息
                .registerAction("bet", this.betHandler.bind(this)) // 投币
                .registerAction("bonus", this.bonusHandler.bind(this)) // bonus玩家点击选择后的消除
                .registerAction("userAccount", this.renderUserAccount.bind(this)) // 用户余额
                .registerAction("bigprize", this.renderFudai.bind(this)) // 福袋渲染
                .registerAction("recover", this.recoverBonus.bind(this)) // bonus复盘
                .registerAction("help", this.renderRateHandler.bind(this)) //福袋倍率


            app.observer
                .subscribe('rightBaseRender', this.rightBaseRender.bind(this)) // 右侧中奖倍率高亮
                .subscribe('leftBonusRender', this.leftBonusRender.bind(this)) // 左侧bonus高亮
                .subscribe('resetGame', this.resetGame.bind(this)) // 重置游戏
                .subscribe('updateUserYuDou', this.updateUserYuDou.bind(this)) // 更新用户的余额
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
            app.messageCenter.emit('help');

            // 已登录
            if (app.gameConfig.isLogin) {
                app.messageCenter.emitAjax("userAccount");

                // 复盘命令
                app.messageCenter.emit('recover');

            } else {
                this.triangleDefaultHandler();
            }
        }

        // 配置参数
        initConfig() {
            this.config = {
                gameReady: false, //游戏是否准备OK
                tingDou: 0, //豆（左）
                yuNum: 0, //余（右）    
                MIN_INPUT: 100,
                MAX_INPUT: 500000,
                isFirstDefault: false, // 是否第一次默认押注金额提示
                user_input_text: 100, //投币金额
                stateSound: 'true', //声音状态
                autoTimesList: [99, 40, 20, 10], //自动玩的次数列表
                autoTimes: 0, // 目前剩余的自动玩次数
                btnStartStatus: 'start_animate', //开始按钮的状态
                bpAmount: 0, //福袋中奖金额
                winAmount: 0 //中奖金额
            }
        }

        // 初始化dom
        initDom() {
            this.dom = {};

            this.top_box.zOrder = 1;

            // marquee_box
            this.dom.marquee_box = this.top_box.getChildByName('marquee_box');
            this.dom.marquee = this.dom.marquee_box.getChildByName('marquee');
            this.dom.btn_back = this.top_box.getChildByName('btn_back'); //回退
            this.dom.btn_back.visible = false;
            this.dom.btn_home = this.top_box.getChildByName('btn_home'); //home键
            this.dom.btn_home.visible = false;
            this.dom.btn_set = this.top_box.getChildByName('btn_set'); //设置

            // 菜单
            this.dom.menu_box = this.top_box.getChildByName('menu_box');
            this.dom.btn_voice = this.dom.menu_box.getChildByName('btn_voice'); //声音
            this.dom.btn_help = this.dom.menu_box.getChildByName('btn_help'); //帮助

            // 福袋金额
            this.dom.fudai_box = this.top_box.getChildByName('fudai_box');
            this.dom.award_num = this.dom.fudai_box.getChildByName('award_num');
            this.dom.fudai_pop = this.dom.fudai_box.getChildByName('fudai_pop');
            this.dom.fudai_rate = this.dom.fudai_pop.getChildByName('fudai_rate');


            // 排行榜按钮
            this.dom.btn_rank = this.bottom_box.getChildByName('btn_rank');

            this.bigTriangle = null; //大三角

            // input输入box
            let input_box = this.bottom_box.getChildByName('input_box');
            this.dom.input_num = input_box.getChildByName('input_num');
            this.dom.btn_sub = input_box.getChildByName('btn_sub');
            this.dom.btn_add = input_box.getChildByName('btn_add');

            // max按钮
            this.dom.btn_max = this.bottom_box.getChildByName('btn_max');

            // 豆box
            let dou_box = this.bottom_box.getChildByName('dou_box');
            this.dom.btn_dou_add = dou_box.getChildByName('btn_dou_add'); //充值按钮
            this.dom.dou_num = dou_box.getChildByName('dou_num'); // 豆

            // 余box
            let yu_box = this.bottom_box.getChildByName('yu_box');
            this.dom.yu_num = yu_box.getChildByName('yu_num'); //余

            // 快速输入
            this.dom.faster_box = this.bottom_box.getChildByName('faster_box');

            // 开始按钮
            let start_box = this.bottom_box.getChildByName('start_box');
            this.dom.start_skeleton = start_box.getChildByName('start_animate');
            this.dom.btn_start = start_box.getChildByName('btn_start');
            this.dom.btn_auto = start_box.getChildByName('btn_auto');
            this.dom.finger = start_box.getChildByName('finger'); //手指
            this.dom.finger.stop();
            this.dom.finger.visible = false;

            // 自动玩
            this.dom.options_box = start_box.getChildByName('options_box');
            this.dom.auto_times = start_box.getChildByName('auto_times');

            // 左侧惊喜奖部分
            let left_bonus = this.middle_box.getChildByName('left_bonus');
            this.dom.leftBonusList = left_bonus.findType('Clip', true);
            this.dom.bonus_skeleton = left_bonus.getChildByName('bonus_skeleton');
            this.dom.notice_skeleton = left_bonus.getChildByName('notice_skeleton');
            this.dom.notice_skeleton.play('text', false);

            // 右侧中奖倍率高亮
            let right_bonus = this.middle_box.getChildByName('right_bonus');
            this.dom.rightBaseList = right_bonus.findType('Clip', true);

            // 提示选择三个三角形
            this.dom.choose_img = this.middle_box.getChildByName('choose_img');

            // 创建惊喜奖爆炸骨骼动画
            let boomSkeleton = Sail.Utils.createSkeleton('images/animation/surprise');
            boomSkeleton.pos(620, 353);
            boomSkeleton.visible = false;
            this.dom.boomSkeleton = boomSkeleton;
            this.middle_box.addChild(boomSkeleton);

        }

        // 初始化三角
        initTriangle() {
            let parent = this.middle_box.getChildByName('triangle');
            let child = new app.Main_triangleView();
            this.bigTriangle = child;

            parent.addChild(child);
        }

        // 初始化底部的赢提示
        initWinBottom() {
            let dom = new app.WinUIView();

            this.dom.win_bottom = dom;
            this.bottom_box.getChildByName('win_box').addChild(dom);
        }

        // 事件初始化
        initEvent() {
            let CLICK = Laya.Event.CLICK;

            // 输入框按钮
            this.dom.input_num.on(CLICK, this, () => {
                // 未登录 
                if (app.utils.willGotoLogin()) {
                    return;
                }

                // 游戏进行中判断
                if (this.checkGameGoing()) {
                    return;
                }

                this.dom.faster_box.visible = !this.dom.faster_box.visible;
            });

            // 减法加法按钮
            this.dom.btn_sub.on(CLICK, this, this.addSubHandler.bind(this, 'sub'));
            this.dom.btn_add.on(CLICK, this, this.addSubHandler.bind(this, 'add'));

            // max
            this.dom.btn_max.on(CLICK, this, this.maxHandler);

            // 余额查询
            this.dom.yu_num.on(CLICK, this, this.yuNumPopBalanceShow);

            // 菜单
            this.dom.btn_set.on(CLICK, this, () => {
                this.dom.menu_box.visible = !this.dom.menu_box.visible;
                app.audio.play('click');
            });

            // 声音按钮
            this.dom.btn_voice.on(CLICK, this, () => {
                app.audio.changeSoundState(this.dom.btn_voice);
            });

            // 帮助按钮
            this.dom.btn_help.on(CLICK, this, () => {
                this.dom.menu_box.visible = false;
                app.observer.publish('helpPopShow');
                app.audio.play('click');

            });

            // 排行榜按钮
            this.dom.btn_rank.on(CLICK, this, () => {
                app.messageCenter.emit('top3');
                app.audio.play('click');

            });
            // 充值按钮
            this.dom.btn_dou_add.on(CLICK, this, () => {
                // 未登录
                if (app.utils.willGotoLogin()) {
                    return;
                }

                app.observer.publish('rechargePopShow');
                app.audio.play('click');

            });

            // 快捷选项
            let itemList = this.dom.faster_box.findType('Box', true);
            itemList.forEach((item, index) => {
                item.on(CLICK, this, () => {
                    app.audio.play('click');

                    let text = item.findType('Label').text;
                    this.updateDomInput(text);
                    this.dom.faster_box.visible = false;
                });
            })

            // 开始
            this.dom.btn_start.on(CLICK, this, () => {
                // 未登录
                if (app.utils.willGotoLogin()) {
                    return;
                }

                // 页面未准备完成 || 余额不足
                if (!this.config.gameReady || !this.isMoneyEnough()) {
                    return;
                }

                let status = this.config.btnStartStatus;

                // 判断是否是正常开始或停止状态
                if (status === 'start_animate') {
                    // 非自动开始
                    this.btnStartHandler(false);
                    app.audio.play('click');
                } else if (status === 'start_static') {

                    console.warn('游戏进行中，不可点...');
                } else {
                    // 停止自动玩，禁用按钮
                    this.startBoxRender('start_static');
                    app.audio.play('click');
                }
            });

            // 自动玩下拉列表
            this.dom.btn_auto.on(CLICK, this, () => {
                // 未登录
                if (app.utils.willGotoLogin()) {
                    return;
                }
                app.audio.play('click');

                this.dom.options_box.visible = !this.dom.options_box.visible;
            });

            let timesList = this.dom.options_box.findType('Box', true);
            timesList.forEach((item, index) => {
                item.on(CLICK, this, () => {
                    this.dom.options_box.visible = false;

                    // 页面未准备完成
                    if (!this.config.gameReady) {
                        return;
                    }
                    app.audio.play('click');

                    this.config.autoTimes = this.config.autoTimesList[index];

                    // 自动玩
                    this.btnStartHandler(true);

                })
            })

            // 福袋小弹层
            this.dom.fudai_box.on(CLICK, this, () => {
                app.audio.play('click');

                this.dom.fudai_pop.visible = !this.dom.fudai_pop.visible;
            })


            // 点击其它区域菜单隐藏
            Laya.stage.on(CLICK, this, (event) => {
                if (!event) {
                    return
                }
                let _target = event.target;
                let menu_box = this.dom.menu_box;
                let faster_box = this.dom.faster_box;
                let options_box = this.dom.options_box;
                let fudai_pop = this.dom.fudai_pop;
                if (!menu_box.visible && !faster_box.visible && !options_box.visible && !fudai_pop.visible) {
                    return;
                }

                // 福袋小弹层
                if (fudai_pop.visible && _target !== this.dom.fudai_box && _target !== fudai_pop && !fudai_pop.contains(_target)) {
                    fudai_pop.visible = false;
                }

                // 菜单栏
                if (menu_box.visible && _target !== this.dom.btn_set && _target !== menu_box && !menu_box.contains(_target)) {
                    menu_box.visible = false;
                }

                // 快捷输入
                if (faster_box.visible && _target !== this.dom.input_num && _target !== faster_box && !faster_box.contains(_target)) {
                    faster_box.visible = false;
                }

                // 自动玩次数
                if (options_box.visible && _target !== this.dom.btn_auto && _target !== options_box && !options_box.contains(_target)) {
                    options_box.visible = false;
                }
            });
        }

        // 判断是否余额足够押注
        isMoneyEnough() {
            let _config = this.config;
            let user_input_text = _config.user_input_text;
            if (_config.yuNum >= user_input_text || _config.tingDou >= user_input_text) {
                return true;
            }

            let cb = () => { app.observer.publish('rechargePopShow') };
            let text = '余额不足，请确定后充值'
            app.observer.publish('commonPopShow', text, cb);

            return false;
        }

        // 随机生成数据
        randomData() {
            let data = [];
            for (let i = 0; i < 16; i++) {
                data.push({
                    n: i,
                    c: app.utils.randomNumber(1, 8),
                    b: app.utils.randomNumber(1)
                })
            }

            console.log(++app.gameConfig.count);

            return LOCAL_DATA;
            return {
                code: 0,
                type: 1,
                initial: data,
                winAmount: 0
            };
        }

        // 初始化信息
        initGameRoomInfo(data) {
            if (Number(data.code) !== 0) {
                this.gameModule.errorHandler(data);
                return;
            }

            this.dom.award_num.text = data.bigprize;
        }

        // 三角默认行为(默认渲染)
        triangleDefaultHandler() {
            let cb = () => { this.config.gameReady = true };
            this.config.gameReady = false;

            // 默认渲染小三角
            this.bigTriangle.dispatchAction(cb.bind(this));
        }

        // bonus复盘
        recoverBonus(data) {
            // 进行复盘
            if (Number(data.code) === 0 && 'initial' in data) {
                let cb = () => { this.config.gameReady = true };

                // 禁用按钮
                this.startBoxRender('start_static');
                this.chooseImgNotice();
                this.bigTriangle.recoverBonus(data, cb);

                // 默认渲染
            } else {
                this.triangleDefaultHandler();
            }
        }

        // 福袋渲染
        renderFudai(data) {
            if (Number(data.code) !== 0) {
                this.gameModule.errorHandler(data);
                return;
            }
            this.dom.award_num.text = data.amount;
        }

        // 开始按钮的渲染
        startBoxRender(type) {
            switch (type) {
                case 'start_static': //开始禁用
                    this.dom.btn_auto.visible = false;
                    this.dom.auto_times.visible = false;
                    this.config.autoTimes = 0;

                    break;
                case 'start_animate': // 开始可用（默认状态）
                    this.dom.btn_auto.visible = true;
                    this.dom.auto_times.visible = false;
                    this.config.autoTimes = 0;

                    break;
                case 'stop_static': //停止_不计时
                    this.dom.btn_auto.visible = false;
                    this.dom.auto_times.visible = false;

                    break;
                case 'stop_animate': //停止_计时
                    this.dom.btn_auto.visible = false;
                    this.dom.auto_times.visible = true;

                    // 把对应的自动玩次数填进去
                    if (--this.config.autoTimes === 0) {
                        this.startBoxRender('start_static');
                        return;
                    }
                    this.dom.auto_times.text = this.config.autoTimes;
                    break;
                default:
                    break;
            }

            // 需要改变时再去重新设置
            if (this.config.btnStartStatus !== type) {
                this.config.btnStartStatus = type;
                this.dom.start_skeleton.play(type, true);
            }
        }

        // 游戏重置
        resetGame() {
            // 出错后直接重置到初始状态
            this.startBoxRender('start_animate');

        }

        // 开始按钮
        btnStartHandler(isAuto) {
            // 是否是自动玩
            if (isAuto) {
                // 自动玩直到bonus奖励
                if (this.config.autoTimes === true) {
                    this.startBoxRender('stop_static');

                } else {
                    this.startBoxRender('stop_animate');
                }

            } else {
                this.startBoxRender('start_static');
            }

            // 清除左侧闪灯
            this.leftBonusRender(0);

            // 关闭
            this.dom.win_bottom.winClose();

            // 小三角退场
            this.bigTriangle.exit();

            // 投币请求
            app.messageCenter.emit('bet', { amount: this.config.user_input_text, isAuto: Number(isAuto) });

            // 本地
            if (app.config.localStatus) {
                this.betHandler(this.randomData());
            }

            Laya.timer.once(30 * 1000, this, this.triangleDefaultHandler);
        }

        // 中奖回调
        awardPopShow(isBonus) {
            let reset = () => {

                // 更新用户余额
                this.updateUserYuDou(this.config.winAmount);

                // 重置赢取金额
                this.config.winAmount = 0;
                this.config.bpAmount = 0;

                // 开始禁用状态 || 自动玩次数为0
                if (this.config.btnStartStatus === 'start_static' || this.config.autoTimes === 0) {
                    // 按钮初始最初状态
                    this.startBoxRender('start_animate');

                } else {
                    // 继续自动玩
                    this.btnStartHandler(true);
                }
            }

            // 不中奖
            if (this.config.winAmount === 0) {
                this.gameModule && this.gameModule.jiujijin();
                reset();

                return;
            }

            // bonus惊喜中奖弹层
            if (isBonus) {
                app.observer.publish('surprisePopShow', this.config.winAmount, () => {
                    reset();

                    // 福袋音效时间过长所以需要手动停止
                    app.audio.stopAllSound();
                });

                app.audio.play('fudai');

                // 普通中奖弹层
            } else {
                // 中奖需弹出中奖弹层后执行重置
                let rate = Math.floor(this.config.winAmount / this.config.user_input_text);
                switch (true) {
                    case rate < 5:
                        reset();
                        break;

                    case rate >= 5 && rate < 10:
                        //中奖弹层
                        app.observer.publish('bigPrisePopShow', 'fantastic', this.config.winAmount, reset);
                        app.audio.play('win');
                        app.audio.play('fantastic');
                        break;

                    case rate >= 10:
                        //中奖弹层
                        app.observer.publish('bigPrisePopShow', 'perfect', this.config.winAmount, reset);
                        app.audio.play('win');
                        app.audio.play('perfect');
                        break;
                }
            }

        }

        // 投币信息处理
        betHandler(data) {
            // 清除
            Laya.timer.clear(this, this.triangleDefaultHandler);

            // 错误码
            if (Number(data.code) !== 0) {
                this.resetGame();
                this.gameModule.errorHandler(data);

                // 防止结果太快
                Laya.timer.once(1000, this, () => { this.triangleDefaultHandler() });

                return;
            }

            // 已登录 && 线上 (记录有效投币额)
            if (app.gameConfig.isLogin && !app.config.localStatus) {
                // 扣减用户金额
                this.updateUserYuDou(-1 * this.config.user_input_text);
                GM.CookieUtil.set("defaultBet" + GM.gameId + GM.user_id, String(this.config.user_input_text));
            }

            // 中奖类型
            switch (Number(data.type)) {
                // bonus情况（待用户选完bonus才能结束）
                case 2:
                    this.bigTriangle.gameDataCome(data, this.chooseImgNotice.bind(this));

                    // 如果是直到bonus则在这可以结束了
                    if (this.config.autoTimes === true) {
                        // 停止自动玩，禁用按钮
                        this.startBoxRender('start_static');
                    }

                    break;

                default:
                    // 中奖金额
                    this.config.winAmount = Number(data.winAmount) || 0;
                    this.config.bpAmount = Number(data.bpAmount) || 0;
                    this.bigTriangle.gameDataCome(data, this.awardPopShow.bind(this));

                    break;
            }
        }

        // bonus选择消除
        bonusHandler(data) {
            // 错误码
            if (Number(data.code) !== 0) {
                this.resetGame();
                this.gameModule.errorHandler(data);
                return;
            }

            // 操作成功(替换bonus为彩色)
            if (!('result' in data)) {
                return;
            }

            // 有bonus奖励了
            if (this.config.autoTimes === true) {
                this.config.autoTimes = 0;
            }

            // 清除左侧bonus灯
            this.leftBonusRender(0);

            // 中奖金额
            this.config.winAmount = Number(data.winAmount);
            this.dom.bonus_skeleton.play('bonus_no', true);
            this.dom.notice_skeleton.play('text', false);

            this.bigTriangle.bonusCancelAngle(data.result, this.awardPopShow.bind(this, true));
        }

        // 游戏进行中判断
        checkGameGoing() {
            // 默认返回undefined
            if (this.config.btnStartStatus !== 'start_animate') {
                console.warn('游戏进行中，不可点...')

                return true;
            }
        }

        // max最大值按钮
        maxHandler() {
            // 未登录
            if (app.utils.willGotoLogin()) {
                return;
            }

            // 游戏进行中判断
            if (this.checkGameGoing()) {
                return;
            }

            app.audio.play('click');

            let yuNum = this.config.yuNum;
            let tingDou = this.config.tingDou;
            let current = yuNum > tingDou ? yuNum : tingDou;
            current = current - current % 100;
            current = current < this.config.MIN_INPUT ? this.config.MIN_INPUT : current;
            current = current > this.config.MAX_INPUT ? this.config.MAX_INPUT : current;

            this.updateDomInput(Number(current));
        }

        // 减法加法
        addSubHandler(type) {
            // 游戏进行中判断
            if (this.checkGameGoing()) {
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

            this.updateDomInput(current);

        }

        // 修改投币金额
        updateDomInput(num) {
            let _num = Number(num);
            this.dom.input_num.text = _num;
            this.config.user_input_text = _num;
        }

        // 异步优化
        myPromise(context, delay) {
            return new Promise((resolve, reject) => {
                Laya.timer.once(delay, context, resolve);
            })
        }

        // 左侧bonus列表
        leftBonusRender(num) {
            let list = this.dom.leftBonusList;
            list.forEach((item, index) => {
                item.index = 0;
                item.scaleX = 1;
                item.scaleY = 1;
            })

            for (let i = 0; i < num; i++) {
                list[i].index = 1;
                list[i].scaleX = 1.1;
                list[i].scaleY = 1.1;
                if (i === 2) {
                    break;
                }
            }
        }

        // 右侧中奖倍率高亮
        rightBaseRender(color) {
            let base = this.dom.rightBaseList[Number(color) - 1];
            base.index = 1;

            Laya.timer.once(1500, this, () => { base.index = 0 });

        }

        // 提示选择三个三角形
        chooseImgNotice() {
            let dom = this.dom.choose_img;
            let boomSkeleton = this.dom.boomSkeleton;

            boomSkeleton.once(Laya.Event.STOPPED, this, () => {
                boomSkeleton.visible = false;
                dom.x = 0;
                dom.visible = true;
                Laya.Tween.to(dom, { x: 440 }, 500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                    Laya.Tween.to(dom, { x: 1334 }, 500, Laya.Ease.backIn, Laya.Handler.create(this, () => { dom.visible = false }), 2000);
                }))
            })

            boomSkeleton.visible = true;
            boomSkeleton.play('start', false);

            this.dom.bonus_skeleton.play('bonus_yes', true);
            this.dom.notice_skeleton.play('start', true);

            app.audio.play('bonus');
        }

        // 获取用户余额
        renderUserAccount(data) {
            let tingDou = Number(data.TCoin) || 0;
            let yuNum = Number(data.total) - tingDou;
            let inputNum;

            this.config.tingDou = tingDou;
            this.config.yuNum = yuNum;
            this.dom.dou_num.text = app.utils.getActiveStr(tingDou);
            this.dom.yu_num.text = app.utils.getActiveStr(yuNum);

            // 仅一次
            if (this.config.isFirstDefault) {
                return;
            }
            this.config.isFirstDefault = true;

            // 获取默认投币额
            let defaultBet = GM.CookieUtil.get("defaultBet" + GM.gameId + GM.user_id);
            defaultBet = defaultBet ? parseInt(defaultBet, 10) : null;

            // 存在cookie默认投币额 && 小于平台子账户余额
            if (defaultBet && defaultBet <= yuNum) {
                inputNum = defaultBet;
            } else {
                // 默认押注金额提示
                inputNum = this.gameModule.defaultInputNotice(tingDou, yuNum);
            }

            //更新投币金额
            this.updateDomInput(inputNum);

            // 默认押注额
            app.observer.publish('commonPopShow', "默认投币额：" + inputNum, null, null, 1500);

        }

        // 游戏中更新挺豆 & 余额
        updateUserYuDou(num) {
            // 增加余额
            if (num >= 0) {
                this._updateUserYu(num);

                // 扣减余额
            } else {
                switch (true) {
                        //挺豆够
                    case (this.config.tingDou + num >= 0):
                        this._updateUserDou(num);
                        break;

                        //余额够
                    case (this.config.yuNum + num >= 0):
                        this._updateUserYu(num);
                        break;

                        // 否则就重新请求
                    default:
                        app.messageCenter.emitAjax("userAccount");
                        break;
                }
            }
        }

        // 更新用户余额（右边）
        _updateUserYu(num) {
            this.config.yuNum = this.config.yuNum + num;
            this.dom.yu_num.text = app.utils.getActiveStr(this.config.yuNum);

        }

        // 更新用户挺豆（左边）
        _updateUserDou(num) {
            this.config.tingDou = this.config.tingDou + num;
            this.dom.dou_num.text = app.utils.getActiveStr(this.config.tingDou);
        }

        // 余额查询
        yuNumPopBalanceShow() {
            app.audio.play('click');

            // 未登录
            if (app.utils.willGotoLogin()) {
                return;
            }

            if (GM && GM.isCall_out === 1 && GM.popBalanceShow_out) {
                GM.popBalanceShow_out(GM.gameType);
            }

            // 更新余额
            app.messageCenter.emitAjax("userAccount");

        }

        // 初始化公共游戏模块
        initCommonGameModule() {
            let module = new app.CommonGameModule();

            // 系统公告
            module.noticeSystem(this.dom.menu_box, 237);
            module.isShowBtnBackHandler(this.dom.btn_back);
            module.isShowBtnHomeHandler(this.dom.btn_home);

            // 跑马灯 
            module.initMarquee(this.dom.marquee);

            this.gameModule = module;
        }

        // 提示小手
        fingerAnimate() {
            let dom = this.dom.finger;
            let time = 30 * 1000;
            let showFinger = () => {
                if (this.checkGameGoing()) {
                    // 让小手隐藏
                    Laya.stage.event(Laya.Event.CLICK);
                } else {
                    dom.visible = true;
                    dom.play('start', true);
                }
            }

            let onceTimeOut = () => {
                Laya.timer.once(time, this, showFinger);
                if (dom.visible) {
                    dom.visible = false;
                    dom.stop();
                }
            }

            onceTimeOut();
            Laya.stage.on(Laya.Event.CLICK, this, () => {
                Laya.timer.clear(this, showFinger);
                onceTimeOut();
            })
        }

        // 福袋倍率
        renderRateHandler(data) {

            this.dom.fudai_rate.text = data.max + '%';

            app.observer.publish('helpRenderTate', data);

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
