/*
 *  菜单只包含在头部场景中，所以菜单只在头部场景实例化
 */
{
    const app = window.app;
    const GM = window.GM;

    class HeaderScene {
        constructor(obj) {
            this.sceneName = 'headerScene';

            // 父元素传进来
            this.top_box = obj;
            this.init();
        }

        init() {

            // 提高层级
            this.top_box.zOrder = 1;

            this.initDom();

            this.initConfig();

            // 初始化事件
            this.initEvent();

            this.initSoundState();

            // 注册
            this.registerAction();

            // 是否显示返回按钮
            this.isShowBtnBackHandler();

            // 是否要显示主页按钮
            this.isShowBtnHomeHandler();

        }

        // 注册
        registerAction() {
            app.messageCenter.registerAction("userAccount", this.renderUserAmount.bind(this)) // 用户余额
                .registerAction("marquee", this.noticeMainHandler.bind(this)) // 公告
                .registerAction("losePointStatus", this.losePointStatusFn.bind(this)) // 输分禁用
                .registerAction("losePoint", this.losePointFn.bind(this)) // 输分提醒

            app.observer.subscribe('updateUserYuDou', this.updateUserYuDou.bind(this));

        }

        // 触发
        dispatchAction() {
            app.messageCenter.emitAjax("userAccount");


        }

        initDom() {

            // 退出房间按钮
            this.btn_back = this.top_box.getChildByName('btn_back');
            this.btn_back.visible = false;
            this.btn_home = this.top_box.getChildByName('btn_home');
            this.btn_home.visible = false;
            // 菜单
            this.btn_menu = this.top_box.getChildByName('btn_menu');
            this.more_box = this.top_box.getChildByName('more_box');
            // 声音按钮
            this.sound_btn = this.more_box.getChildByName('sound_btn');
            this.help_btn = this.more_box.getChildByName('help_btn');

            this.yu_box = this.top_box.getChildByName('yu_box');
            this.you_box = this.top_box.getChildByName('you_box');

            // 跑马灯
            this.marquee_box = this.top_box.getChildByName('marquee_box');
            this.dom_marquee = this.marquee_box.getChildByName('dom_marquee');

            // 充值按钮
            this.btn_chong = this.yu_box.getChildByName('btn_chong');
            // 挺豆
            this.dom_dou_num = this.yu_box.getChildByName('yu_num');
            // 余额
            this.dom_yu_num = this.you_box.getChildByName('you_num');


            // 初始化跑马灯
            this.initMarquee();

        }

        initConfig() {
            this.config = {
                isFirstDefault: false, // 是否第一次默认押注金额提示
                soundStateKey: 'superstars_sound', //声音的状态
                stateSound: '', //声音的状态
                tingDou: 0,
                yuNum: 0
            }
        }

        // 初始化事件可能会在频繁remove后被移除，故在外部被add后初始化
        //直接写在内部的事件却不会被移除（疑问？？？）
        initEvent() {
            // 菜单
            this.btn_menu.on(Laya.Event.CLICK, this, () => {

                this.more_box.visible = !this.more_box.visible;
                app.audio.play('click');

            });

            // 声音
            this.sound_btn.on(Laya.Event.CLICK, this, this.changeSoundState);

            // 帮助按钮
            this.help_btn.on(Laya.Event.CLICK, this, () => {
                app.observer.publish('helpPopShow');
                this.more_box.visible = false;
                app.audio.play('click');

            });


            // 余额查询
            this.dom_yu_num.on(Laya.Event.CLICK, this, this.yuNumPopBalanceShow);

            // 充值按钮
            this.btn_chong.on(Laya.Event.CLICK, this, () => {

                // 发布
                app.observer.publish("rechargePopShow");
                app.audio.play('click');
            });


            // 点击其它区域菜单隐藏
            Laya.stage.on(Laya.Event.CLICK, this, (event) => {
                let _target = event.target;
                if (this.more_box.visible && _target !== this.btn_menu && _target !== this.more_box && !this.more_box.contains(_target)) {

                    this.more_box.visible = false;
                }
            });
        }


        // 初始化跑马灯
        initMarquee() {
            let options = { colorHigh2: '#ffe400', fontSize: 25 };
            // y方向更居中一点
            this.dom_marquee.y = 8;

            // 跑马灯内容
            this.marquee_ui_box = new app.MarqueeLaya(this.dom_marquee, options);
        }

        // 公告渲染
        noticeMainHandler(data) {
            if (Number(data.code) === 0) {
                this.marquee_ui_box.start(data.notice);
            }
        }

        // 初始化声音状态
        initSoundState() {
            // 存cookie
            let _current = app.audio.getCookie(this.config.soundStateKey);

            if (_current === 'false') {
                this.config.stateSound = 'false';
                this.sound_btn.index = 1;

                // 静音
                app.audio.setMuted();

                return;
            }

            if (_current === '') {
                app.audio.setCookie(this.config.soundStateKey, 'true');
            }

            this.config.stateSound = 'true';
            this.sound_btn.index = 0;

            // 打开声音
            app.audio.setMutedNot();

        }

        // 改变声音状态
        changeSoundState() {
            app.audio.play('click');

            if (this.config.stateSound === 'true') {
                this.config.stateSound = 'false';
                this.sound_btn.index = 1;
                app.audio.setMuted();

            } else {
                this.config.stateSound = 'true';
                this.sound_btn.index = 0;
                app.audio.setMutedNot();

            }

            app.audio.setCookie(this.config.soundStateKey, this.config.stateSound);
        }

        // 渲染用户金额
        renderUserAmount(data) {
            this.config.tingDou = Number(data.TCoin) || 0;
            this.config.yuNum = (Number(data.total) - this.config.tingDou) || 0;

            this.dom_dou_num.text = app.utils.getActiveStr(this.config.tingDou);
            this.dom_yu_num.text = app.utils.getActiveStr(this.config.yuNum);

            // 默认押注金额提示
            this.defaultInputNotice();
        }

        // 游戏中更新挺豆 & 余额
        updateUserYuDou(num) {
            // 增加余额
            if (num >= 0) {
                this._updateUserYu(num);

                // 扣减余额
            } else {
                //挺豆够扣的话就扣挺豆
                if (this.config.tingDou + num >= 0) {
                    this._updateUserDou(num);

                    //否则扣余额
                } else {
                    this._updateUserYu(num);
                }
            }

        }

        // 更新用户余额（右边）
        _updateUserYu(num) {
            this.config.yuNum = this.config.yuNum + num;
            this.dom_yu_num.text = app.utils.getActiveStr(this.config.yuNum);

        }

        // 更新用户挺豆（左边）
        _updateUserDou(num) {
            this.config.tingDou = this.config.tingDou + num;
            this.dom_dou_num.text = app.utils.getActiveStr(this.config.tingDou);
        }

        // 默认提示按住额提示
        defaultInputNotice() {
            if (this.config.isFirstDefault) {
                return;
            }
            this.config.isFirstDefault = true;

            let tingDou = this.config.tingDou;
            let yuNum = this.config.yuNum;
            let total = tingDou > yuNum ? tingDou : yuNum;
            let inputNum;
            let cookieBet = this.defaultBetHandler(yuNum);

            if(typeof cookieBet === 'number'){
                inputNum = cookieBet;
            }else{
                // 处理倍率
                inputNum = this.dealWithNum(total);
            }

            // 默认按住额
            app.observer.publish('warmNoticePopShow', "默认投币额：" + inputNum);

            Laya.timer.once(1500, this, () => {
                app.observer.publish('warmNoticePopHide');
            });

            //更新投币金额
            app.observer.publish('updateDomInput', inputNum);

        }

        // 初始化默认投注额
        defaultBetHandler(restScore){
            var cookie = GM.CookieUtil.get("defaultBet"+GM.gameId+GM.user_id);
            var defaultBet =  cookie ? parseInt(cookie, 10) : null;

            if(defaultBet && defaultBet <= Number(restScore) ){   // restScore 平台子账户余额
                return defaultBet;    //  将游戏原有的默认押注额改为cookies里面存的值
            }
        }

        // 处理倍率
        dealWithNum(total) {
            let result;
            let isAdd = false; //是否进位
            if (total <= 10000) {
                result = 100;

            } else {
                result = Math.ceil(total / 100);

                // 先转字符串
                result = String(result);
                for (let i = 1, l = result.length; i < l; i++) {
                    if (result[i] !== '0') {
                        isAdd = true;
                    }
                }

                result = isAdd ? Number(result[0]) + 1 + result.slice(1).replace(/\d/g, '0') : result;
            }

            // 最后转数字
            result = Number(result);
            result = result > 500000 ? 500000 : result;

            return result;
        }

        // 不中险&救济金
        activityShow(data) {
            let _prize = '';
            let txt = '';
            if (data.buzhongxian) {
                _prize = data.buzhongxian.prizePoint;
                txt = "恭喜赢取不中险，金额： " + _prize;
            } else if (data.helpAmount) {
                _prize = data.helpAmount.prizePoint;
                txt = "恭喜赢取救济金，金额： " + _prize;
            }

            // 不中险加入余额中
            this.updateUserYuDou(_prize);

            // 仅读弹层
            app.observer.publish('onlyReadPopShow', txt);
        }

        // 输分提醒
        losePointFn(data) {
            let losePL = data;
            let _level = losePL.level;
            let text = `您的输分金额已达上限，故账户禁用开始时间：${losePL.beginTime}，禁用结束时间：${losePL.endTime}`;
            if (_level === 2 || _level === 3) {
                app.observer.publish('commonPopShow', text, true);
            }

            // 停止游戏
            app.observer.publish('errorHandler', { code: 'losePoint' });
        }

        // 黑名单输分禁用
        losePointStatusFn(data) {
            let text = '客官，您已被输分禁用，请联系客服！';
            app.observer.publish('commonPopShow', text, true);

            // 停止游戏
            app.observer.publish('errorHandler', { code: 'losePoint' });

        }

        // 余额查询
        yuNumPopBalanceShow() {
            app.audio.play('click');
            if (GM && GM.isCall_out === 1 && GM.popBalanceShow_out) {
                // audio.play('an_niu');

                GM.popBalanceShow_out(GM.gameType);
            }

        }

        // 是否要显示返回按钮
        isShowBtnBackHandler() {
            // Laya 返回按钮
            if (window.GM && GM.isCall_out === 1 && GM.isShowBtnBack_out && GM.btnBackCall_out) {
                this.btn_back.visible = true; // 显示返回按钮
                this.btn_back.on(Laya.Event.CLICK, this, GM.btnBackCall_out);
            }
        }

        // 是否要显示home主页按钮
        isShowBtnHomeHandler() {
            if (GM.backHomeUrl) {
                // 显示按钮
                this.btn_home.visible = true;
                // 绑定事件
                this.btn_home.on(Laya.Event.CLICK, this, () => { location.href = GM.backHomeUrl; });
            }
        }

    }

    app.HeaderScene = HeaderScene;


}
