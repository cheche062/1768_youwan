/*
 *  菜单只包含在头部场景中，所以菜单只在头部场景实例化
 */
{
    const app = window.app;
    const GM = window.GM;
    const menuUI = window.menuUI;
    const headerUI = window.headerUI;

    class MenuScene extends menuUI {
        constructor() {
            super();

            this.sceneName = 'menuScene';
            this.init();

        }

        init() {
            this.hide();
            // 初始状态开
            this.initState();
            this.initEvent();

        }

        initState() {
            // 存cookie
            let _current = app.audio.getCookie('fruit_sound');

            if (_current === '' || _current === 'true') {
                app.audio.setCookie('fruit_sound', 'true');
                this.stateSound = 'true';
                this.btn_sound.index = 0;

            } else if (_current === 'false') {
                this.stateSound = 'false';
                this.btn_sound.index = 1;
            }

        }

        initEvent() {
            // 声音按钮
            this.btn_sound.on(Laya.Event.CLICK, this, this.soundFn);
            // 帮助按钮
            this.btn_help.on(Laya.Event.CLICK, this, this.helpFn);
            // 战绩
            this.btn_help.on(Laya.Event.CLICK, this, this.helpFn);
        }

        helpFn() {
            // 发布帮助弹层出现
            app.observer.publish('helpPopShow');

            this.hide();

        }

        soundFn() {
            if (this.stateSound === 'true') {
                this.stateSound = 'false';
                this.btn_sound.index = 1;
                app.audio.setMuted();
            } else {
                this.stateSound = 'true';
                this.btn_sound.index = 0;
                app.audio.setMutedNot();
            }

            app.audio.setCookie('fruit_sound', this.stateSound);
        }
        show() {
            this.visible = true;
        }
        hide() {
            this.visible = false;
        }
    }


    class HeaderScene extends headerUI {
        constructor() {
            super();
            this.sceneName = 'headerScene';
            this.init();

        }

        init() {

            this.initDom();

            this.initConfig();

            // 初始化事件
            this.initEvent();

            this.initBtnHome();

            // 跑马灯遮罩
            this.addMaqueeMask();

            // 注册
            this.registerAction();

        }

        // 注册
        registerAction() {
            app.messageCenter.registerAction("userAccount", this.renderUserAmount.bind(this)) // 用户信息
                .registerAction("exitRoom", app.enterHall) // 注册退出房间
                .registerAction("gameNotice", this.marqueeGo.bind(this)) // 注册公告信息
                .registerAction("getProfitPool", this.getProfitPoolFn) // 注册盈利榜奖池10分钟一次
                .registerAction("awardTips", this.awardFudaiGo.bind(this)) // 进入游戏福袋分奖提示
                .registerAction("losePoint", this.losePointFn.bind(this)) // 输分提醒
                .registerAction("losePointStatus", this.losePointStatusFn.bind(this)) // 输分禁用
                .registerAction("cmd::caution", this.wltCaution.bind(this)) // 万里通积分改造
                .registerAction("transferToPlatform", this.transferToPlatformFn.bind(this)) // 确认收获
                .registerAction("exchangeGameCoin", this.exchangeGameCoinFn.bind(this)) // 正在兑入
                .registerAction("advertise", this.advertiseHandle.bind(this)) // 广告
                .registerAction("activity", this.activityShow.bind(this)); // 不中险

        }

        // 触发
        dispatchAction() {

            app.messageCenter.emit("userAccount");

            this.onceEmitGetProfitPool();
        }

        // 触发一次
        onceEmitGetProfitPool() {
            this.loopGetProfitPool();

            Laya.timer.clear(this, this.loopGetProfitPool);
            //3分钟
            Laya.timer.loop(3 * 60 * 1000, this, this.loopGetProfitPool);
        }

        // 获取盈利榜奖池
        loopGetProfitPool() {
            app.messageCenter.emit("getProfitPool");

        }

        initDom() {
            // 初始化菜单
            this.menuUI = new MenuScene();
            this.menu_box.addChild(this.menuUI);

            // 退出房间按钮
            this.btn_back = this.head_box.getChildByName('btn_back');
            // 菜单
            this.btn_menu = this.head_box.getChildByName('btn_menu');
            // 主页按钮
            this.btn_home = this.head_box.getChildByName('btn_home');
            // 充值按钮
            this.btn_chong = this.yu_box.getChildByName('btn_chong');
            // 收获按钮
            this.btn_shou = this.you_box.getChildByName('btn_shou');

            // 游戏值
            this.you_num = this.you_box.getChildByName('you_num');
            // 余额值
            this.yu_num = this.yu_box.getChildByName('yu_num');

            // 战绩按钮
            this.btn_record = this.head_box.getChildByName('btn_record');

            // 跑马灯
            this.dom_text_box = this.marquee_box.getChildByName('text_box');
            // 跑马灯内容
            this.dom_text_content = this.dom_text_box.getChildByName('text_content');

            // 福袋分奖骨骼动画
            this.fudai_DB = this.head_box.getChildByName('fudai_DB');
            this.fudai_DB.visible = false;
            this.fudai_DB.stop();


        }

        // 初始化配置参数
        initConfig() {
            this.config = {
                LEFT: this.marquee_box.width, //信息内容初始的x坐标
                intervalTime: { //时间间隔
                    1: 10 * 1000, //普通跑马灯 
                    2: 2 * 1000 //获奖跑马灯
                },
                currentType: 1, //当前跑马灯类型   1:普通型， 2：获奖型
                modelData: [
                    '恭喜*赢了*，实在是太厉害了！',
                    '祝贺*赢取*，积少成多从现在开始。',
                    '恭喜*赢取*，满屏掌声献给他！'
                ],
                count: 0,
                youxiBi: 0, //游戏币
                yuNum: 0, //余额
                noticeMsgData: [],
                isGoing: false //是否已经启动
            }
        }

        // 初始化事件可能会在频繁remove后被移除，故在外部被add后初始化
        //直接写在内部的事件却不会被移除（疑问？？？）
        initEvent() {

            // 退出房间
            this.btn_back.on(Laya.Event.CLICK, this, () => {

                // 判断是否还有币 || 拉吧依然在转动
                if (app.matterCenter.coinCount > 0 || app.room_ui_box.configLaba.loopHasStart) {
                    app.observer.publish('quit_rechargePopShow', 'quit', true);

                    // 页面切换带来的事件(暂停自动玩)
                    app.room_ui_box.pageChange(true, 3);

                    // 直接退出
                } else {

                    // 加载弹层显示
                    app.observer.publish('fruitLoadingShow');
                    app.messageCenter.emit('exitRoom');
                }

            });

            // 菜单
            this.btn_menu.on(Laya.Event.CLICK, this, () => {
                this.menuUI.visible = !this.menuUI.visible;

            });

            // 余额查询
            this.yu_num.on(Laya.Event.CLICK, this, () => {
                this.yuNumPopBalanceShow();

            });

            // 充值按钮
            this.btn_chong.on(Laya.Event.CLICK, this, () => {
                // 发布
                app.observer.publish("rechargePopShow");

            });

            // 收获按钮
            this.btn_shou.on(Laya.Event.CLICK, this, () => {
                // 未登录
                if (!app.utils.checkLoginStatus()) {
                    app.utils.gotoLogin();

                    return;
                }

                // 发送请求
                app.messageCenter.emit('accoutDetail');

                // 发布
                app.observer.publish("shouhuoPopShow", this.you_num.text);

            });

            // 我的战绩弹层
            this.btn_record.on(Laya.Event.CLICK, this, () => {
                // 登录才发送命令
                if (app.utils.checkLoginStatus()) {
                    app.messageCenter.emit('betPrizeList');
                }

                app.observer.publish("mygradePopShow");

            });

            // 点击其它区域菜单隐藏
            Laya.stage.on(Laya.Event.CLICK, this, (event) => {
                let _target = event.target;
                if (this.menuUI.visible && _target !== this.btn_menu && _target !== this.menuUI && !this.menuUI.contains(_target)) {
                    this.menuUI.hide();
                }
            });
        }

        // 初始化主页按钮
        initBtnHome(){
            let btnHomeUrl = this.btn_home;

            // 默认 不显示按钮
            btnHomeUrl.visible = false;
            if( GM.backHomeUrl ){
                  // 显示按钮
                  btnHomeUrl.visible = true;
                  // 绑定事件
                  btnHomeUrl.on('click', this, function(){
                       location.href = GM.backHomeUrl;
                  });
            }

        }

        // 渲染用户金额
        renderUserAmount(data) {
            this.config.youxiBi = Number(data.amount);
            this.config.yuNum = Number(data.totalScore);
            let _yu = app.utils.getActiveStr(data.totalScore);
            let _you = app.utils.getActiveStr(data.amount);
            this.yu_num.text = _yu;
            this.you_num.text = _you;
        }

        // 更新用户游戏币（右边）
        updateUserCoin(num) {
            let result = Number(this.config.youxiBi) + Number(num);

            if (result < 0) {
                app.messageCenter.emit("userAccount");

            } else {
                // 当前游戏币存好
                this.config.youxiBi = result;

                this.you_num.text = app.utils.getActiveStr(result);
            }
        }

        // 更新用户余额（左边）
        updateUserYu(num) {
            let result = Number(this.config.yuNum) + Number(num);
            this.config.yuNum = result;

            this.yu_num.text = app.utils.getActiveStr(result);

        }

        // 跑马灯遮罩
        addMaqueeMask() {
            let marquee = this.marquee_box;
            marquee.mask = new Laya.Sprite();
            marquee.mask.graphics.clear();
            marquee.mask.graphics.drawRect(0, 0, marquee.width, marquee.height, '#000000');
        }

        // 当前跑马灯信息进场
        currentNoticeIn(text) {
            let _box = this.dom_text_box;
            this.dom_text_content.text = text;
            _box.x = this.config.LEFT;

            Laya.Tween.to(_box, { x: 0 }, 3000, Laya.Ease.linearIn, Laya.Handler.create(this, this.currentNoticeOut));

        }

        // 当前跑马灯信息离场
        currentNoticeOut() {
            let config = this.config;
            let _box = this.dom_text_box;
            let moveX = parseInt(_box.displayWidth);

            Laya.Tween.to(_box, { x: -moveX }, 2000, Laya.Ease.linearIn, Laya.Handler.create(this, this.renderNextNotice), config.intervalTime[config.currentType]);

        }

        // 渲染下一条公告
        renderNextNotice() {
            let config = this.config;
            let noticeMsgData = config.noticeMsgData;
            // let text = '';
            // 当前信息
            let msg = noticeMsgData.shift();
            noticeMsgData.push(msg);

            // 普通公告(由后台做了这段逻辑)
            /*if(config.currentType === 1){
                text = msg;

            // 获奖公告
            }else{
                let modelData = config.modelData;
                let modelArr = modelData[(config.count++)%3].split('*');
                text = `${modelArr[0]}${msg.name}${modelArr[1]}${msg.award}${modelArr[2]}`;
            }*/

            this.currentNoticeIn(msg);
        }

        // 跑马灯开启
        marqueeGo(data) {
            let config = this.config;
            config.currentType = Number(data.type) || 2;
            config.noticeMsgData = data.notice || config.noticeMsgData;

            // 只启动一次
            if (!config.isGoing) {
                config.isGoing = true;
                this.renderNextNotice();
            }
        }

        // 盈利榜奖池(写入数据)
        getProfitPoolFn(data) {
            if (Number(data.code) === 0) {
                let pool = Number(data.pool);
                app.gameConfig.pool = parseInt(pool);
                app.observer.publish('upDatePool', pool);
            }

            // 盈利榜是否关闭
            app.gameConfig.ylbStatus = data.ylbStatus;
        }

        // 不中险&救济金
        activityShow(data) {
            let _prize = '';
            let txt = '';
            if (data.buzhongxian) {
                _prize = data.buzhongxian.prizePoint;
                txt = `别担心，“平安不中险”已为您的损失买单！近期损失的${_prize}欢乐值已返还给您`;
            } else if (data.helpAmount) {
                _prize = data.helpAmount.prizePoint;
                txt = "恭喜赢取救济金，金额： " + _prize;
            }

            // 不中险加入余额中
            this.updateUserYu(_prize);

            // 仅读弹层
            app.observer.publish('onlyReadPopShow', txt);
        }

        // 福袋分奖骨骼动画
        awardFudaiGo(data) {
            if (Number(data.code) !== 0) {

                return;
            }

            let prize = data.award;

            this.fudai_DB.once(Laya.Event.STOPPED, this, () => {
                this.fudai_DB.play('loop', true);

                Laya.timer.once(3000, this, () => {
                    this.fudai_DB.play('end', false);

                    // 福袋奖励弹层
                    app.observer.publish('gainPopShow', prize);
                    // 更新余额
                    this.updateUserYu(prize);
                    // 获取奖池数据
                    this.loopGetProfitPool();
                });

            });

            this.fudai_DB.visible = true;
            this.fudai_DB.play('start', false);
        }

        // 输分提醒
        losePointFn(data) {
            let losePL = data;
            let _level = Number(losePL.level);
            let text = '';
            if(typeof _level !== 'number'){
                return;
            }
            if (_level === 1) {
                text = '客官，休息一会儿，说不定还可以转转运哦~';
            }
            if (_level === 2 || _level === 3) {
                text = `您的输分金额已达上限，故账户禁用开始时间：${losePL.beginTime}，禁用结束时间：${losePL.endTime}`;
            }

            app.observer.publish('commonPopShow', text, true);

            // 如果正在自动玩则停止
            app.room_ui_box.willStopAutoPlay();
        }

        // 黑名单输分禁用
        losePointStatusFn(data) {
            let text = '客官，您已被输分禁用，请联系客服！';
            app.observer.publish('commonPopShow', text, true);

            // 如果正在自动玩则停止
            app.room_ui_box.willStopAutoPlay();
        }

        // 万里通积分改造
        wltCaution(data){
            //万里通积分授权
            if(data.code == "1001"){
                 GM.accredit && GM.accredit();
            }
            //输分禁用
            if(data.code == "1000"){
                GM.jumpToHomePage && GM.jumpToHomePage("blacklist_disable");
            }

        }

        // 余额查询
        yuNumPopBalanceShow() {
            if (GM && GM.isCall_out === 1 && GM.popBalanceShow_out) {
                // audio.play('an_niu');

                GM.popBalanceShow_out(GM.gameType);
            }

        }

        // 确认收获
        transferToPlatformFn(data) {
            if (Number(data.code) === 0 && data.userAccount.code === 'success') {
                app.observer.publish('commonPopShow', '收获成功！', true);

            }
            let result = {
                amount: 0,
                totalScore: this.config.youxiBi + this.config.yuNum
            }

            this.renderUserAmount(result);
        }

        // 兑入提示
        exchangeGameCoinFn(data) {
            if (Number(data.code) === 0) {
                let _txt = `自动为您带入${data.changeCoin}游戏币...`
                app.observer.publish('normalPopShow', _txt);
            }
        }

        // 广告
        advertiseHandle(data) {
            let _pic = '';
            if (typeof data.pic === 'string') {
                _pic = data.pic.trim();
            }
            if (Number(data.code) === 0 && _pic !== '') {
                Laya.loader.load(_pic, Laya.Handler.create(this, () => {
                    app.observer.publish('advertisePopShow', _pic);

                }));

            }
        }

        // 被移除头部
        removeHeader() {

            this.removeSelf();

            // 切换场景后必然更新
            this.dispatchAction();
        }

    }

    app.HeaderScene = HeaderScene;


}
