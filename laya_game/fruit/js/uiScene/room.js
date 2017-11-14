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
            this.initConfig();
            this.initDom();
            this.initEvent();

            // 重置技能
            this.skillReset();
            // 计算位置坐标
            this.addPositions();

            // 拉吧水果添加遮罩
            this.addLabaMask();

            // 小车添加遮罩
            this.addCarMask();

            // 初始化拉吧
            this.initLaba();

            // 限制laba累计灯函数的执行频率
            this.renderSaveLight = window._.throttle(this._renderSaveLight, 500);

            //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
            app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
        }
        onEnter() {
            app.utils.log(this.sceneName + " enter");

            //取消订阅时不用传递回调函数
            app.observer.unsubscribe(this.sceneName + "_enter");

            // 场景进入完毕后再添加头部；
            this.addHeader();

            // 循环背景灯闪动
            this.ballLightLoop();

            // 注册
            this.registerAction();

            // 触发
            this.dispatchAction();

        }

        // 注册
        registerAction() {
            app.messageCenter.registerAction("pullStart", this.labaDataCome.bind(this)) // 拉吧数据来了
                .registerAction("enterRoom", this.enterRoomFn.bind(this)) // 投币没钱后会返回这个接口
                .registerAction("buffStart", this.renderSkill.bind(this)) // buff
                .registerAction("buff", this.buffWork.bind(this)) // buff效果
                .registerAction("show", this.renderStarNum.bind(this)) // 星星奖励
                .registerAction("pallet", this.palletAward.bind(this)) // 托盘奖励
                .registerAction("onlineTableNum", this.renderTableNum.bind(this)) // 在桌子上的人数
                .registerAction("isNew", this.isNewHandle.bind(this)) // 是否是新用户
                .registerAction("palletTrigger", this.renderCarBase.bind(this)); // （风扇）倍率变化;

            // 绑定盈利榜金额
            app.observer.subscribe('upDatePool', (data) => {
                let _num = Math.floor(data);
                // 盈利榜金额
                this.ylb_num.text = _num === 0 ? "0" : _num;

            });
        }

        // 取消注册
        unRegisterAction() {
            // 取消订阅盈利榜金额更新
            app.observer.unsubscribe('upDatePool');

            app.messageCenter.unRegisterAction('pullStart')
                .unRegisterAction('enterRoom')
                .unRegisterAction('buffStart')
                .unRegisterAction('buff')
                .unRegisterAction('palletTrigger')
                .unRegisterAction('pallet')
                .unRegisterAction('onlineTableNum')
                .unRegisterAction('isNew')
                .unRegisterAction('show');

        }

        // 触发
        dispatchAction() {
            app.messageCenter.emit('isNew');

        }

        // 配置参数
        initConfig() {
            this.config = {
                nailPosList: [], //钉子坐标集合
                skillPosList: [], //技能坐标集合
                coinInitPos: { x: this.coin.x, y: this.coin.y }, //金币初始坐标
                fansInitPos: [ //风扇初始坐标
                    { x: this.fan0.x, y: this.fan0.y },
                    { x: this.fan1.x, y: this.fan1.y }
                ],
                swingsInitPos: [ //摆针初始坐标
                    { x: this.swing0.x, y: this.swing0.y },
                    { x: this.swing1.x, y: this.swing1.y }
                ],
                swingSize: { w: this.swing0.width, h: this.swing0.height },
                STATIC_Y: this.spin_box.y, //spin的固定y坐标
                carEarPosList: [], //两只车柄
                carPos: null //车
            };

            // 技能名字与背景对应
            this.skillNameUrl = {
                jetton: 'jiangli', //奖(筹码)
                pallet: 'stop', //托盘停
                mul: 'bei', //倍率
                light: 'add_3', //增加累计灯
                spin: 'add_spin' //spin 
            };

            // laba相关的状态配置，水果与索引的对应
            this.configLaba = {
                fruitTypeNum: 9, //水果的种类个数（包括星星）
                sameRoundBoxYarr: [115, 196, 281], //光圈的y坐标数组
                highLineCount: 0, //高亮线闪烁计数
                labaStopCount: 0, //laba将要停止的计数
                loopHasStart: false, //laba循环已经开始
                totalResult: [], //所有的水果结果
                fruitResult: [ //当前这一把的水果结果
                    [0, 0, 0],
                    [1, 1, 1],
                    [2, 2, 2]
                ]
            }

            //  轮盘参数
            this.configTurntableList = {
                one:{ 100: 0, 1000: 60, 200: 120, 400: 180, 300: 240, 500: 300 },
                two:{ 300: 0, 1000: 60, 400: 120, 600: 180, 500: 240, 800: 300 },
                three:{ 1000: 0, 10000: 60, 2000: 120, 4000: 180, 3000: 240, 5000: 300 }
            }

            // 关于房间配置
            this.configRoom = {
                secondPrize: 0, // 二等奖界限
                skillExist: [0, 1, 2, 3, 4, 5, 6, 7], //技能存在的位置
                labaCover_stauts_save: null, //laba遮罩状态存储值
                currentLabaStatus: 0, //纪录当前的laba蒙层状态值（为了判断是否改变，如不变的话就不处理）
                currentSaveLight: 0, //纪录当前laba累计灯数量，理由同上
                isTurntable: false, //这把是否是轮盘奖
                luckyNum: 0, //第几排中奖
                luckyArr: [], //中奖的图标索引（光效）
                roomType: '',
                prize: 0,
                isAutoPlay: false, //是否是自动玩
                top_listActivate: false, //累计灯是否激活
                labaCoverActivate: false, //laba上下两行是否同时激活
                willExitRoom: false //用户点开退出按钮（可能要离开）
            }

            // 小车托盘配置数据
            this.configCar = {
                plusWidth: this.dom_plus.displayWidth, //‘+’宽度
                carBoxWidth: this.car_box.displayWidth, //‘car_box’宽度
                HEIGHT: this.car_text0.height, //一个文本数字的高度
                WIDTH: this.dom_text_box.width, //多个文本数字的宽度
                totalCarBase: [], //小车数字的数组
                currentBase: 0, //当前的数字
                isGoing: false //是否正在滚动
            }
        }

        initDom() {
            // 查看按钮
            this.btn_look = this.look_box.getChildByName('btn_look');
            // 在线人数
            this.online_num = this.look_box.getChildByName('online_num');

            // 盈利榜奖励
            this.ylb_num = this.ylb_box.getChildByName('ylb_num');

            // 星星奖励
            this.star_list = this.star_box.findType('Label');
            // 星星的骨骼动画
            this.star_DB = this.star_box.getChildByName('star_DB');
            this.star_DB.stop();

            // top小灯
            this.top_list = this.top_light_box.findType('Clip');

            // 钉子集合
            this.nail_list = this.nail_box.findType('Image');

            // 技能集合
            this.skill_list = this.skill_box.findType('Image');
            // 遮挡小旗
            this.flag = this.getChildByName('flag');

            // 小车
            this.car_earList = this.car_box.find('car_ear', true);
            this.car_body = this.car_box.find('car_body');
            // 小车骨骼动画
            this.car_DB = this.car_box.find('car_DB');
            this.car_DB.visible = false;
            this.car_DB.stop();

            // 拉吧区域
            // 拉吧蒙层上
            this.dom_cover_up = this.cover_box.getChildByName('cover_up');
            // 拉吧蒙层下
            this.dom_cover_down = this.cover_box.getChildByName('cover_down');

            // 拉吧3列水果集合
            this.laba_item_list = this.laba_mask_box.findType('Box');

            // 轮盘
            this.dom_turntable = this.turntable_box.getChildAt(0).getChildByName('turntable');
            // 转盘骨骼动画
            this.table_DB = this.turntable_box.getChildByName('table_DB');
            this.table_DB.stop();

            // 自动玩按钮
            this.dom_auto = this.btn_auto_box.getChildByName('auto');
            // 自动投币的光效
            this.dom_light = this.btn_auto_box.getChildByName('light');

            // 背景闪灯(骨骼动画)
            this.ballLight_DB = this.middle_box.getChildByName('ballLight_DB');
            this.ballLight_DB.stop();

            // 高亮的线(集合)
            this.highLineList = this.threeLine_box.findType('Image');

            // 相同水果转的光效
            this.sameRoundList = this.sameRound_box.find('item', true);
            this.sameRoundList.forEach((item) => { item.stop() });

            // 房间场型和赔率金币
            // this.dom_room_type = this.look_box.getChildByName('room_type');

        }

        // 添加坐标
        addPositions() {

            // 钉子坐标集合
            let _arr = [];
            this.nail_list.forEach((item) => {
                _arr.push({ x: item.x, y: item.y });
            })
            this.config.nailPosList = _arr;

            // 技能坐标集合
            let _arr2 = [];
            let _pX = this.skill_box.x;
            let _pY = this.skill_box.y + this.skill_list[0].y;
            this.skill_list.forEach((item) => {
                _arr2.push({ x: item.x + _pX, y: _pY });
            })
            this.config.skillPosList = _arr2;

            // 小车坐标
            let _arr3 = [];
            let car_box = this.car_box;
            this.car_earList.forEach((item) => {
                _arr3.push({ x: item.x + car_box.x - 100, y: item.y + car_box.y });
            })
            this.config.carEarPosList = _arr3;
            this.config.carPos = { x: this.car_body.x - 100 + car_box.x, y: this.car_body.y + car_box.y };

        }

        // 事件初始化
        initEvent() {

            // 自动玩启动
            this.btn_auto_box.on(Laya.Event.CLICK, this, this.autoAddCoin);
            // 自动按钮(状态变化)
            this.dom_auto.on(Laya.Event.CHANGE, this, () => {
                let _index = this.dom_auto.index;
                if (_index === 2) {
                    this.dom_light.autoPlay = true;
                    Laya.timer.loop(500, this, this.loopAddCoin);

                } else if (_index === 0 || _index === 3) {
                    this.dom_light.autoPlay = false;
                    this.dom_light.index = 0;

                    Laya.timer.clear(this, this.loopAddCoin);
                }
            })

            // 掉金币的按钮（大的空box）
            this.btn_addCoin.on(Laya.Event.CLICK, this, () => {
                // 判断自动玩
                if (!this.configRoom.isAutoPlay) {
                    // 已经限制住了
                    if (app.gameConfig.timeLimit) {
                        return;
                    }

                    app.gameConfig.timeLimit = true;
                    Laya.timer.once(250, this, () => { app.gameConfig.timeLimit = false; });
                    app.messageCenter.emit('bet', { type: this.configRoom.roomType, auto: 0 });
                }

            });

            // 查看玩家
            this.btn_look.on(Laya.Event.CLICK, this, () => {
                // 查看当前桌上的所有玩家
                app.messageCenter.emit('myTableList');

            });

            // 盈利榜按钮
            this.ylb_num.on(Laya.Event.CLICK, this, () => {
                // 盈利榜开启时才发送命令
                if (app.gameConfig.ylbStatus === 1) {

                    app.messageCenter.emit("profixRank");

                    app.observer.publish('yinglibangPopShow');

                } else {
                    // 公共提示                                          
                    app.observer.publish('commonPopShow', '盈利榜暂未开放');
                }

            });

            // 切换页面事件
            window.$(document).on('visibilitychange', this.pageChange.bind(this, false));

        }

        // 页面切换事件(type:如果点开退出弹框则为true， 否则是false, false时候第二个参数指定index)
        // index: 2 自动玩； index: 3 暂停
        pageChange(type, index) {
            // 用户点开了退出弹框
            this.configRoom.willExitRoom = type;
            if (this.configRoom.isAutoPlay) {
                this.dom_auto.index = this.dom_auto.index === 2 ? 3 : 2;
                if (type) {
                    this.dom_auto.index = index;
                    // 关掉退出弹框
                    if (index === 2) {
                        this.configRoom.willExitRoom = false;
                    }

                } else {
                    this.dom_auto.index = this.dom_auto.index === 2 ? 3 : 2;
                }

            }
        }

        // 是否是新用户
        isNewHandle(data) {
            if (Number(data.code) === 0 && Number(data.result) === 0) {
                app.observer.publish('newUserPopShow', '*' + app.gameConfig.baseCoin);
            }
        }

        // 处理投币没钱的情况
        enterRoomFn(data) {
            if (data.code === 10) {
                // 暂停自动玩
                this.dom_auto.index = 3;
                app.observer.publish('quit_rechargePopShow', 'less', true, '余额不足，请先充值');

            }
        }

        // 自动投币
        autoAddCoin() {
            this.configRoom.isAutoPlay = !this.configRoom.isAutoPlay;
            this.dom_auto.index = 1;

            Laya.timer.once(200, this, () => {
                this.dom_auto.index = this.configRoom.isAutoPlay ? 2 : 0;
            });
        }

        // 自动投币
        loopAddCoin() {
            app.messageCenter.emit('bet', { type: this.configRoom.roomType, auto: 1 });

        }

        // 由于投币后错误就停止自动玩
        willStopAutoPlay() {
            if (this.configRoom.isAutoPlay) {
                this.btn_auto_box.event(Laya.Event.CLICK);
            }
        }

        /**
         * { item_description }
         * 
         * 渲染房间信息
         * 
         */

        // 渲染房间信息
        renderRoomInfo(data) {
            let tableInfo = data.tableInfo;

            // 星星奖励
            this.renderStarNum(tableInfo);

            // 累计灯(一排四盏)
            this.renderSaveLight(tableInfo.pull.lamp);

            // 拉吧部分蒙层的渲染
            this.labaCoverStatus(tableInfo.pull.status);

            // 渲染小车的倍率(托盘)
            this.renderCarBase(tableInfo);

            // 盈利榜金额
            this.ylb_num.text = Math.floor(data.poolAmount);

            // 房间类型&基本倍率
            this.renderTypeCoin(tableInfo);

            // 渲染场次对应的轮盘皮肤
            this.renderTableSkin();
        }

        // 渲染场次对应的轮盘皮肤
        renderTableSkin(){
            let _type = this.configRoom.roomType;
            let _url = '';
            let key = '';
            switch (_type) {
                case 'new':
                    _url = 'turntable';
                    key = 'one';
                    break;
                case 'low':
                    _url = 'turntable';
                    key = 'one';
                    break;
                case 'middle':
                    _url = 'turntable_middle';
                    key = 'two';
                    break;
                case 'high':
                    _url = 'turntable_high';
                    key = 'three';
                    break;
            }

            // 转盘皮肤
            this.dom_turntable.skin = `room/${_url}.png`;

            // 对应金额和角度
            this.configTurntable = this.configTurntableList[key];

        }

        // 在桌人数
        renderTableNum(data) {
            this.online_num.text = data.count;
        }

        // 房间类型&基本倍率
        renderTypeCoin(tableInfo) {
            // 金币基数 
            let _base = Number(tableInfo.base);
            let _type = tableInfo.tableId.slice(0, tableInfo.tableId.indexOf(':'));
            let name = '';
            // 房间类型
            this.configRoom.roomType = _type;

            /*switch (_type) {
                case 'new':
                    name = '新手场';
                    break;
                case 'low':
                    name = '初级场';
                    break;
                case 'middle':
                    name = '中级场';
                    break;
                case 'high':
                    name = '高级场';
                    break;
            }*/

            app.gameConfig.baseCoin = _base;
            this.dom_room_type.text = '*' + _base;

        }

        // 星星值变化
        renderStarNum(data) {
            // 颠倒一下渲染
            if (!Array.isArray(data.prize)) {
                return;
            }

            let _data = data.prize.reverse();
            this.star_list.forEach((item, index) => {
                item.text = _data[index];
            });
            // 赋值二等奖界限
            this.configRoom.secondPrize = Number(_data[1]);
            this.star_DB.play('start', false);
        }

        // 渲染laba的累计灯
        // 该函数的执行需要限制频率
        _renderSaveLight(data) {
            // 累计灯数量
            let num = Number(data);

            // 判断是否改变
            if (this.configRoom.currentSaveLight === num) {

                return;
            }
            // 当前累计灯赋值
            this.configRoom.currentSaveLight = num;


            this.top_list.forEach((item, index) => {
                item.index = index < num ? 1 : 0;
            })

            // 每次都来初始一下未激活
            this.configRoom.top_listActivate = false;

            // 没暂停
            if (this.dom_auto.index !== 3 && num === 4) {

                // 更改累计灯的激活状态
                this.configRoom.top_listActivate = true;

            }

            // 暂停
            if (this.dom_auto.index === 3 && num !== 0) {

                // 更改累计灯的激活状态
                this.configRoom.top_listActivate = true;

            }

            // 检验是否暂停自动玩
            return this.checkPauseAutoPlay();

        }

        // 存储laba遮罩状态
        // 存储的目的：防止上一把的中奖结果还未结束就更新遮罩区，造成中奖动效出现在未开放区的误导
        saveLabaCoverStatus(data) {
            // 判断laba是否在循环运行中(是的话就要暂先存储)
            if (this.configLaba.loopHasStart) {
                this.configRoom.labaCover_stauts_save = data;
            } else {
                this.labaCoverStatus(data);
            }
        }

        // 拉吧部分蒙层的渲染
        labaCoverStatus(data = 0) {
            let num = Number(data);
            let _up = 0;
            let _down = 0;

            // 判断是否改变
            if (this.configRoom.currentLabaStatus === num) {

                return;
            }
            // 当前laba状态值
            this.configRoom.currentLabaStatus = num;
            // 高亮线
            this.highLineAnimate(num);
            switch (num) {
                case 0:
                    break;
                case 1:
                    _up = 1;
                    _down = 1;
                    break;
                case 2:
                    _up = 1;
                    break;
                case 3:
                    _down = 1;
                    break;
            }

            this.dom_cover_up.visible = _up ? false : true;
            this.dom_cover_down.visible = _down ? false : true;

            // 更改laba遮罩区的激活状态
            if (_up && _down) {
                this.configRoom.labaCoverActivate = true;
            } else {
                this.configRoom.labaCoverActivate = false;
            }

            // 检验是否暂停自动玩
            return this.checkPauseAutoPlay();

        }

        // 高亮线的闪烁效果
        highLineAnimate(num = 0) {
            // 如果为0 不予处理
            if (Number(num) === 0) {

                return;
            }
            switch (Number(num)) {
                case 1:
                    this.highLineList.forEach((item, index) => {
                        item.visible = true;
                    });

                    break;
                case 2:
                    this.highLineList.forEach((item, index) => {
                        if (index === 0 || index === 1) {
                            item.visible = true;
                        } else {
                            item.visible = false;
                        }
                    });
                    break;
                case 3:
                    this.highLineList.forEach((item, index) => {
                        if (index === 2 || index === 1) {
                            item.visible = true;
                        } else {
                            item.visible = false;
                        }
                    });
                    break;
            }

            Laya.timer.clear(this, this.highLineLoop);
            Laya.timer.loop(500, this, this.highLineLoop);
        }

        // 高亮线的循环
        highLineLoop() {
            if (this.configLaba.highLineCount++ > 5) {
                Laya.timer.clear(this, this.highLineLoop);
                this.configLaba.highLineCount = 0;
                this.threeLine_box.visible = false;

                return;
            }
            this.threeLine_box.visible = !this.threeLine_box.visible;
        }

        // 检验是否暂停自动玩
        checkPauseAutoPlay() {
            // 并没有开启自动玩 用户点开退出按钮
            if (this.dom_auto.index === 0 || this.configRoom.willExitRoom) {

                return;
            }

            // 页面已切走
            if (document.visibilityState && document.visibilityState === 'hidden') {
                return;
            }

            // laba累计灯 上下两行都打开  同时激活状态
            if (this.configRoom.labaCoverActivate && this.configRoom.top_listActivate) {
                // 暂停
                if (this.dom_auto.index !== 3) {
                    this.dom_auto.index = 3;
                    app.observer.publish('normalPopShow', '累计灯已满，自动为您暂停投币');
                }
            } else {
                // 自动玩
                if (this.dom_auto.index !== 2) {
                    this.dom_auto.index = 2;
                }
            }
        }

        // 加载头部
        addHeader() {
            let _header = app.header_ui_box;
            _header.btn_back.visible = true;
            _header.btn_shou.visible = false;

            return this.header_box.addChild(_header);
        }

        /**
         * { item_description }
         * 
         * 
         * buff 逻辑区域
         */

        // 技能重置
        skillReset() {
            this.skill_list.forEach((item) => {
                item.visible = false;
            });
        }

        // 技能渲染 (索引位置， 类型)
        renderSkill(data) {
            let target = this.configRoom.skillExist;
            let buff = data.buff;
            let type = buff.type;
            let skillNameUrl = this.skillNameUrl;

            if (target.length === 0) {
                app.utils.log('技能没有空位。。。');
                return;
            }
            // 随机索引
            let _index = app.utils.randomNumber(target.length - 1);
            let target_index = target[_index];
            let _skill = this.skill_list[target_index];
            target.splice(_index, 1);

            _skill.skin = 'room/' + skillNameUrl[type] + '.png';
            _skill.alpha = 1;
            _skill.visible = true;

            // buff8秒后渐隐
            Laya.Tween.to(_skill, { alpha: 0 }, 2 * 1000, Laya.Ease.linearIn, null, 8 * 1000);

            // 刚体渲染buff
            return app.matterCenter.addSkills(target_index, buff);

        }

        // buff生效
        buffWork(data) {
            let _type = data.type;

            switch (_type) {
                // 奖励金额
                case 'jetton':
                    app.header_ui_box.updateUserCoin(data.amount);
                    app.utils.log('奖励:' + data.amount);
                    break;

                    // 托盘停
                case 'pallet':
                    app.matterCenter.buffSkillStop('pallet', data.time);
                    app.utils.log('托盘停止时间:' + data.time);
                    break;

                    // 倍率
                case 'mul':

                    app.utils.log('倍率变化:');
                    break;

                    // 累计灯加三个
                case 'light':
                    this.renderSaveLight(data.lamp);
                    app.utils.log('累计灯现在是:' + data.lamp);
                    break;

                    // spin停止
                case 'spin':
                    app.matterCenter.buffSkillStop('spin', data.time);
                    app.utils.log('spin停止时间:' + data.time);
                    break;
            }


        }

        /**
         * { item_description }
         * 
         * 
         * 
         * 托盘区域逻辑(小车)
         */

        // 添加小车遮罩
        addCarMask() {
            let text_box = this.dom_text_box;
            text_box.mask = new Laya.Sprite();
            text_box.mask.graphics.clear();
            text_box.mask.graphics.drawRect(0, 0, this.configCar.WIDTH, this.configCar.HEIGHT, '#000000');
        }

        // 托盘奖励
        palletAward(data) {
            if (data.code !== 0) {
                app.utils.warn(data.msg);
                return;
            }
            // 中奖金额
            return app.header_ui_box.updateUserCoin(data.amount);
        }

        // 小车倍数
        renderCarBase(data) {
            let current = data.amount || data.pallet || '0';
            this.configCar.totalCarBase.push(current);
            this.configCar.currentBase = current;

            if (!this.configCar.isGoing) {
                this.configCar.isGoing = true;
                return this.animationCarBase();
            }

        }

        // 倍数动画
        animationCarBase() {
            let topY = this.configCar.HEIGHT * -1;
            let _box = this.dom_text_move;
            let current = this.configCar.totalCarBase.shift();

            if (typeof current === 'undefined') {

                this.configCar.isGoing = false;
                return;
            }
            this.car_text1.text = current;
            Laya.Tween.to(_box, { y: topY }, 800, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                // 恢复位置
                this.car_text0.text = current;
                _box.y = 0;

                // 调整一下位置居中
                let centerX = (this.configCar.carBoxWidth - this.configCar.plusWidth - this.car_text0.displayWidth) / 2;
                this.dom_car_boxMove.x = centerX;

                // 再次自调用
                return this.animationCarBase();

            }));
        }

        // 小车的动画效果（把手闪动）
        cartoonFn(index, position) {
            // 小车两只把手
            let _ear = null;
            let _index = Number(index);
            let text = Number(this.configCar.currentBase);
            // 车身
            if (_index === 2) {
                // 小车身的骨骼动画
                _ear = this.car_body;
                this.car_DB.visible = true;
                this.car_DB.play('car', false);

                // 左右把手
            } else {
                _ear = this.car_earList[_index];
                _ear.autoPlay = true;

                let callback = _index === 0 ? this.earStopLeft : this.earStopRight;
                Laya.timer.clear(this, callback);
                Laya.timer.once(2200, this, callback);
                text = Math.floor(text / 2);
            }

            // 飘字效果
            this.cartoonFontAnimate(text, position);
        }

        // 托盘奖励飘字效果
        cartoonFontAnimate(text, position) {
            let domLabel = new Laya.Label();
            domLabel.font = 'car_font';
            domLabel.text = '+' + text;
            this.addChild(domLabel);
            domLabel.pos(position.x, position.y - 30);

            Laya.Tween.to(domLabel, { y: domLabel.y - 80 }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                domLabel.destroy(true);
            }))

        }


        // 把手停止闪动
        earStopLeft() {
            this.car_earList[0].autoPlay = false;
            this.car_earList[0].index = 0;
        }
        earStopRight() {
            this.car_earList[1].autoPlay = false;
            this.car_earList[1].index = 0;
        }

        /**
         * { item_description }
         * { item_description }
         * { item_description }
         * { item_description }
         * { item_description }
         * 
         * laba 逻辑区域
         * 数据来了读取数据，放入数组，启动循环laba，取出首个数据开始laba，
         * 
         */

        // 拉吧添加遮罩
        addLabaMask() {
            let laba = this.laba_mask_box;
            laba.mask = new Laya.Sprite();
            laba.mask.graphics.clear();
            laba.mask.graphics.drawRect(0, 0, laba.width, laba.height, '#000000');
        }

        // 创建水果元素
        createFruit(index) {
            let _clip = new Laya.Clip();
            let _num = this.configLaba.fruitTypeNum;
            if (index === -1) {
                index = app.utils.randomNumber(_num - 1);
            }
            _clip.skin = 'room/clip_fruit.png';
            _clip.clipY = _num;
            _clip.index = index;

            return _clip;
        }

        // 初始化拉吧水果
        initLaba() {
            let fruitIndex = [-1, -1, -1, -1, -1, -1];

            this.laba_item_list.forEach((item, index) => {
                let _clipArr = [];
                fruitIndex.forEach((current, i) => {
                    let _f = this.createFruit(current);
                    _f.y = 80 * i;
                    _clipArr.push(_f);
                })

                // 一列列存放
                item.addChildren(..._clipArr);
                // 只算一次
                if (index === 0) {
                    // 倒数第四个水果
                    this.config.labaInitPostionY = -(item.getChildAt(item.numChildren - 4).y + 80);
                }
                //位置放上边
                item.y = this.config.labaInitPostionY;

                // 标志符号
                item.count = 0;
            })

        }

        // laba数据来了
        labaDataCome(data) {

            // 存储数据
            this.configLaba.totalResult.push(data);

            // 开始拉吧的数据循环读取并显示水果结果
            // 添加标识符, laba循环已经开始就不需要再次循环
            if (this.configLaba.loopHasStart) {

                return;
            }

            this.configLaba.loopHasStart = true;

            // 首先执行一次(现在不使用循环laba，而是通过回调再来读取数据启动laba)
            this.loopLaba();

        }

        // 循环laba的数据读取并启动laba
        loopLaba() {
            // 取出第一个数据
            let data = this.configLaba.totalResult.shift();

            // 拉吧每次启动后再去检查更新laba的状态（laba遮罩渲染）
            if (this.configRoom.labaCover_stauts_save !== null) {
                this.labaCoverStatus(this.configRoom.labaCover_stauts_save);
                this.configRoom.labaCover_stauts_save = null;
            }

            if (typeof data === 'undefined') {
                // 清除循环

                return this.clearLoopLaba();

            } else {
                // 启动laba
                return this.labaGo(data);
            }
        }

        // 清除laba循环数据读取
        clearLoopLaba() {
            this.configLaba.loopHasStart = false;
        }

        // 停止拉吧(由于公用一个循环函数存在变量变化时机的互相影响，所以要先后的去变)
        labaStop() {
            this.laba_item_list.forEach((item, index) => {
                ((item, index) => {
                    Laya.timer.once(index * 400, this, () => {
                        item.count = 1;
                    });
                })(item, index);
            })
        }

        // 拉吧启动
        labaGo(data) {
            let arr = data.icon;

            // 中轮盘将
            this.configRoom.isTurntable = data.type === 4 ? true : false;

            // 中奖金额
            this.configRoom.prize = Number(data.prize);

            // 计算几排 光圈(只有中奖了才有必要计算)
            if (Number(data.prize) > 0) {
                this.getSameRoundPosition(data.luckyNum, arr);
            }
            // 存储灯
            this.renderSaveLight(data.lamp);

            // 数据写入
            this.configLaba.fruitResult.forEach((item, index) => {
                arr.forEach((itemIner, indexIner) => {
                    item[indexIner] = itemIner[index];
                });
            });

            // laba停止的计数器置0
            this.configLaba.labaStopCount = 0;

            // 先后的开始laba动画
            for (let i = 0; i < 3; i++) {
                Laya.timer.once(400 * i, this, this.labaAnimate.bind(this, i));
            }

        }

        // 拉吧运动开始
        labaAnimate(listIndex) {
            let labaItem = this.laba_item_list[listIndex];
            let callback = null;
            let _prize = this.configRoom.prize;

            // 可以停止了（三条拉吧需要各自判断）
            if (labaItem.count === 1) {
                let _result = this.configLaba.fruitResult;
                labaItem.count = 0;
                labaItem.getChildAt(0).index = _result[listIndex][0];
                labaItem.getChildAt(1).index = _result[listIndex][1];
                labaItem.getChildAt(2).index = _result[listIndex][2];

                // 最后一行停止后即出获奖弹层
                if (listIndex === 2) {
                    let fn = null;
                    // 出轮盘奖
                    if (this.configRoom.isTurntable) {
                        fn = this.turntableGo.bind(this, _prize);

                        // 直接出中奖弹层
                    } else if (_prize > 0) {
                        fn = () => {

                            // 中奖结果
                            this.showAwardResult(_prize);

                        }
                    }
                    // else if (_prize <= 0) {
                    //     // 救济金调用
                    //     // app.jiujijin();

                    // }

                    // 转盘或者出中奖弹层
                    if (!!fn) {
                        callback = Laya.Handler.create(this, () => {

                            // 开始先光圈高亮
                            this.sameRoundShow();

                            Laya.timer.once(2000, this, () => {
                                // 停止光圈
                                this.stopAllSameRound();

                                fn();
                            });

                        });

                    } else {
                        callback = Laya.Handler.create(this, () => {
                            return this.loopLaba();
                        });

                    }

                }

                // 还未停止继续拉吧ing
            } else {
                // laba继续
                callback = Laya.Handler.create(this, this.labaToTop, [listIndex]);

            }

            // 为下一次运动做准备
            if (labaItem.y === 0) {
                return this.labaToTop(listIndex);
            } else {
                return Laya.Tween.to(labaItem, { y: 0 }, 400, Laya.Ease.linearIn, callback);
            }
        }

        // 拉吧回到初始位置且看起来不动
        labaToTop(listIndex) {
            let labaItem = this.laba_item_list[listIndex];
            let randomNumber = app.utils.randomNumber;
            let _num = this.configLaba.fruitTypeNum - 1;

            let child0 = labaItem.getChildAt(0);
            let child1 = labaItem.getChildAt(1);
            let child2 = labaItem.getChildAt(2);
            // 下边三只同步到下边三只
            labaItem.getChildAt(3).index = child0.index;
            labaItem.getChildAt(4).index = child1.index;
            labaItem.getChildAt(5).index = child2.index;

            labaItem.y = this.config.labaInitPostionY;

            child0.index = randomNumber(_num);
            child1.index = randomNumber(_num);
            child2.index = randomNumber(_num);

            // 拉吧停止的计数（不用定时器去停止laba，因为不准, 数字25是测出来的）
            if (this.configLaba.labaStopCount++ >= 25) {
                this.configLaba.labaStopCount = 0;
                this.labaStop();
            }

            // 再次运动
            return this.labaAnimate(listIndex);

        }

        // 异步优化
        myPromise(context, delay) {
            return new Promise((resolve, reject) => {
                Laya.timer.once(delay, context, resolve);
            })
        }

        // 轮盘中奖启动(中奖金额)
        turntableGo(data) {
            let _prize = data || this.configRoom.prize;
            let _turntable = this.dom_turntable;
            let _rotation = this.configTurntable[_prize] + 3 * 360;

            // 晚些显示转盘
            _turntable.rotation = 0;

            return this.myPromise(this, 0)
                .then(() => {
                    this.turntable_box.visible = true;

                    return this.myPromise(this, 500);
                })
                .then(() => {
                    Laya.Tween.to(_turntable, { rotation: _rotation }, 1000, Laya.Event.circOut);

                    return this.myPromise(this, 1000);
                })
                .then(() => {
                    this.table_DB.once(Laya.Event.STOPPED, this, () => {

                        this.turntable_box.visible = false;

                        // 中奖结果
                        this.showAwardResult(_prize);

                    });

                    // 骨骼动画
                    this.table_DB.play('turntable', false);
                })
        }

        // 中奖结果
        showAwardResult(_prize) {
            let type = '';

            if (_prize >= this.configRoom.secondPrize) {
                type = 'superAwardPopShow';

                // 播放音效
                Laya.timer.once(350, this, () => { app.audio.play('bigWin') })

            } else {
                type = 'smallAwardPopShow';

                // 播放音效
                app.audio.play('smallWin');
            }


            // 更新余额
            app.header_ui_box.updateUserCoin(_prize);

            app.observer.publish(type, _prize);

            // 再次读取拉吧数据启动laba
            return this.loopLaba();
        }

        /**
         * { function_description }
         * { function_description }
         * { function_description }
         * 拉吧高亮的线条
         * 
         * 拉吧相同水果的光圈
         * 
         */

        // 判断第几行中奖 中奖图标的位置
        getSameRoundPosition(luckyNum, icon) {
            let whichIndex = 0;
            let luckyArr = [];
            let obj = {};
            // 第几排中奖
            this.configRoom.luckyNum = Number(luckyNum);
            whichIndex = '102'.charAt(Number(luckyNum) - 1);

            let targetArr = icon[whichIndex];
            // 找出相同项，并把对应的索引扔进数组
            targetArr.forEach((item, index, array) => {
                if (typeof obj[item] === 'undefined') {
                    obj[item] = index;

                } else {
                    luckyArr.push(obj[item]);
                    if (luckyArr[luckyArr.length - 1] === luckyArr[luckyArr.length - 2]) {
                        luckyArr.pop();
                    }
                    luckyArr.push(index);
                    obj[item] = index;
                }
            })

            // 有可能没有相同水果但是有单独的星星
            if (luckyArr.length === 0) {
                targetArr.forEach((item, index) => {
                    if (item === 8) {
                        luckyArr.push(index);
                    }
                })
            }

            // 赋值
            this.configRoom.luckyArr = luckyArr;

        }

        // 光圈显示(number, arr)
        sameRoundShow() {
            let which = Number(this.configRoom.luckyNum);
            let luckyArr = this.configRoom.luckyArr;
            which = '102'.charAt(which - 1);

            this.sameRoundList.forEach((item, index) => {
                if (luckyArr.indexOf(index) > -1) {
                    item.visible = true;
                    item.play('start', true);
                } else {
                    item.visible = false;
                }
            })

            // 光圈的box显示
            this.sameRound_box.visible = true;
            this.sameRound_box.y = this.configLaba.sameRoundBoxYarr[which];

        }

        // 停止所有的动态光圈
        stopAllSameRound() {
            // 全部停止
            this.sameRoundList.forEach((item, index) => {
                item.stop();
            })

            // box隐藏
            this.sameRound_box.visible = false;

        }


        // 循环背景灯闪动
        ballLightLoop() {
            Laya.timer.loop(30 * 1000, this, this.ballLightPlay);
        }

        ballLightClear() {
            Laya.timer.clear(this, this.ballLightPlay)
        }

        // 背景灯30秒闪动
        ballLightPlay() {
            this.ballLight_DB.play('bglight', false);
        }

        onExit() {
            app.utils.log(this.sceneName + " exit");

            // 解除页面切换侦听事件
            window.$(document).off('visibilitychange');

            // 清除laba循环
            this.clearLoopLaba();

            // 清除背景灯循环闪动
            this.ballLightClear();

            // 停止自动投币
            this.dom_auto.index = 0;

            // 离开房间把laba停止
            this.labaStop();

            // 取消所有注册
            this.unRegisterAction();

            // 退出场景前把头部移除
            app.header_ui_box.removeHeader();

            // 离开物理引擎世界
            app.matterCenter.leaveMatter()

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
