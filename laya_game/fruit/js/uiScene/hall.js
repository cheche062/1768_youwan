//大厅
{
    const app = window.app;
    const GM = window.GM;
    const hallUI = window.hallUI;

    class HallScene extends hallUI {
        constructor(options) {
            super();

            this.sceneName = "hallScene";
            this.init();
        }

        //初始化
        init() {

            this.initDom();
            this.initEvent();

            //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
            app.observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
        }

        onEnter() {
            app.utils.log(this.sceneName + " enter");
            //取消订阅时不用传递回调函数
            app.observer.unsubscribe(this.sceneName + "_enter");

            // 添加头部
            this.addHeader();

            // 注册
            this.registerAction();

            // 系统公告
            this.noticeSystem();

            // 准备完毕且已登录触发请求
            if (app.utils.checkLoginStatus()) {
                this.dispatchAction();
            }

        }

        // 注册
        registerAction() {
            app.messageCenter.registerAction("roomList", this.renderRoomList.bind(this)) // 房间列表
                .registerAction("onlineUserNum", this.renderOnLineUser.bind(this)) // 更新房间在线人数
                .registerAction("enterRoom", app.enterRoom.bind(app)); // 请求进入房间


        }

        // 取消注册
        unRegisterAction() {
            app.messageCenter.unRegisterAction('roomList')
                .unRegisterAction('onlineUserNum')
                .unRegisterAction('enterRoom')

        }

        // 触发
        dispatchAction() {
            app.messageCenter.emit("roomList");

            //5分钟
            Laya.timer.loop(300000, this, this.onlineUserNum);

        }

        // 请求在线人数
        onlineUserNum() {
            app.messageCenter.emit("onlineUserNum");

        }

        // 清除5分钟一次的在线人数请求
        clearOnlineUserNum() {
            Laya.timer.clear(this, this.onlineUserNum);

        }

        initDom() {
            // 快速开始
            this.btn_quick = this.middle_box.getChildByName('btn_quick');
            // 公告按钮
            this.btn_notice = this.middle_box.getChildByName('btn_notice');
            // 小红点
            this.redPoint = this.middle_box.getChildByName('redPoint');
            // 盈利榜按钮
            this.btn_gainList = this.middle_box.getChildByName('btn_gainList');

            // 房间列表
            this.roomList = {
                new: this.room_box.getChildByName('new'),
                low: this.room_box.getChildByName('low'),
                middle: this.room_box.getChildByName('middle'),
                high: this.room_box.getChildByName('high')
            };
        }

        // 加载头部
        addHeader() {
            let _header = app.header_ui_box;
            _header.btn_back.visible = false;
            _header.btn_shou.visible = true;

            this.header_box.addChild(_header);
        }

        initEvent() {

            // 公告请求
            // this.btn_notice.on(Laya.Event.CLICK, this, this.noticeFn);

            // 快速进入房间
            this.btn_quick.on(Laya.Event.CLICK, this, () => {
                // 是否登录
                app.utils.willGotoLogin();

                // 加载弹层显示
                app.observer.publish('fruitLoadingShow');

                app.messageCenter.emit("enterRoom", { type: 'quick' });

            });

            // 盈利榜按钮
            this.btn_gainList.on(Laya.Event.CLICK, this, () => {
                // 盈利榜开启时才发送命令
                if (app.gameConfig.ylbStatus === 1) {

                    app.messageCenter.emit("profixRank");

                    app.observer.publish('yinglibangPopShow');

                } else {
                    // 错误提示
                    app.observer.publish('commonPopShow', '盈利榜暂未开放');
                }
            });

            //房间列表添加事件请求 
            Object.values(this.roomList).forEach((item, index, arr) => {
                item.on(Laya.Event.CLICK, this, () => {
                    // 是否登录
                    app.utils.willGotoLogin();

                    // 加载弹层显示
                    app.observer.publish('fruitLoadingShow');

                    app.messageCenter.emit("enterRoom", { type: item.name });
                });
            })

        }

        // 系统公告
        noticeSystem() {
            if (window.GM && GM.isCall_out === 1 && GM.noticeStatus_out) {

                GM.noticeStatus_out(this.noticeCallBack.bind(this));
            }

        }

        noticeCallBack(data = {}) {
            // 是否显示系统公告
            if (!data.isShowNotice) {

                return;
            }

            // 是否需要显示小红点
            if (data.isShowRedPoint) {
                // 显示小红点
                this.redPoint.visible = true;
            }

            this.btn_notice.on(Laya.Event.CLICK, this, () => {
                // audio.play('an_niu');

                // 直接隐藏小红点
                this.redPoint.visible = false;
                GM.noticePopShow_out && GM.noticePopShow_out();

            });

            // 显示出公告按钮
            this.btn_notice.visible = true;
        }

        // 渲染各房间在线人数
        renderOnLineUser(data) {
            let _list = data.onlineList;
            Object.keys(_list).forEach((item, index) => {
                this.roomList[item].find('people').text = _list[item] || '0';
            })
        }

        // 渲染房间列表信息
        renderRoomList(data) {
            let onlineList = data.onlineList;
            let roomTypeList = data.roomTypeList;

            Object.keys(onlineList).forEach((item, index) => {
                let _room = this.roomList[item];
                let _data = roomTypeList[item];

                // 该房间数据存在
                if (_data) {
                    _room.visible = _data.switch === '1' ? true : false;
                    _room.find('min_num').text = _data.condition + '以上';
                    _room.find('base').text = _data.rate;
                    _room.find('people').text = onlineList[item] + '人';
                }

            });
        }

        // 退出场景
        onExit() {
            app.utils.log(this.sceneName + " exit");

            app.header_ui_box.removeHeader();

            // 取消大厅所有注册
            this.unRegisterAction();

            // 取消5分钟一次的在线人数请求
            this.clearOnlineUserNum();

            //发布退出事件
            app.observer.publish(this.sceneName + "_exit");

            this.clear();
        }

        //自定义方法，场景退出的时候是销毁还是removeself请自行抉择
        clear() {
            this.destroy(true);
        }
    }

    app.HallScene = HallScene;

}
