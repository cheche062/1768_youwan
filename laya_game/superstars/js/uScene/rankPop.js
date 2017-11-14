/*
 *  排行榜
 */
{
    const app = window.app;
    const rankPopUI = window.rankPopUI;

    class RankPopDialog extends rankPopUI {
        constructor(...args) {
            super(...args);
            this.init();
        }

        init() {

            this.initDom();

            this.initConfig();

            // 初始化事件
            this.initEvent();

            // 注册
            this.registerAction();

        }

        // 注册
        registerAction() {
            app.messageCenter.registerAction("rank", this.renderUserAmount.bind(this))
                .registerAction("day", this.renderRankList.bind(this))
                .registerAction("week", this.renderRankList.bind(this))
                .registerAction("month", this.renderRankList.bind(this))

            // 订阅弹层出现
            app.observer.subscribe('rankPopShow', this.myShow.bind(this));

        }

        // 触发
        dispatchAction() {

            // 加载中
            this.isLoadingOrContent(1);
            // 发送ajax
            app.messageCenter.emitAjax('day');
            app.messageCenter.emit('rank');


        }

        initDom() {

            // 关闭
            this.dom_close_btn = this.getChildByName('close_btn');

            // 土豪榜列表
            this.dom_rich_list = this.find('item', true);


        }

        // 初始化配置参数
        initConfig() {
            this.config = {
                isFirstMyList: true, //第一次渲染我的战绩
                periodArr: ['day', 'week', 'month'],
                isFirst: true //第一次进来
            }
        }

        //直接写在内部的事件却不会被移除（疑问？？？）
        initEvent() {

            // 关闭按钮
            this.dom_close_btn.on(Laya.Event.CLICK, this, this.close);

            // 跳登录
            this.dom_unloaded.on(Laya.Event.CLICK, this, app.utils.gotoLogin);
            this.dom_unloaded.color = '#d9e200';

            // tab切换
            this.tab_nav.selectHandler = Laya.Handler.create(this, this.tabSwitchHandler, null, false);


        }

        // tab切换
        tabSwitchHandler(index) {
            let _target = 0;
            let type;

            if (index === 3) {
                _target = 1;

                this.isLoadingOrContent(1);

                // 发送排行榜请求
                app.messageCenter.emit('rank');

            } else {
                _target = 0;
                type = this.config.periodArr[index];

                // 加载中
                this.isLoadingOrContent(1);
                // 发送ajax
                app.messageCenter.emitAjax(type);
            }

            this.tab_con.selectedIndex = _target;

            app.audio.play('click');
        }

        // 加载中。。。or 显示数据
        isLoadingOrContent(type) {
            // 暂无数据
            if (type === 0) {
                this.dom_loading.visible = true;
                this.dom_loading.text = '虚位以待...';
                this.tab_con.visible = false;
                this.dom_unloaded.visible = false;

                // 加载中
            } else if (type === 1) {
                this.dom_loading.visible = true;
                this.dom_loading.text = '加载中...';
                this.tab_con.visible = false;
                this.dom_unloaded.visible = false;

                // 显示内容
            } else if (type === 2) {
                this.dom_loading.visible = false;
                this.tab_con.visible = true;
                this.dom_unloaded.visible = false;

                // 未登录
            } else if (type === 3) {
                this.dom_loading.visible = false;
                this.tab_con.visible = false;
                this.dom_unloaded.visible = true;
            }


        }

        // 富豪榜渲染
        renderRichList(data) {
            let top3 = data.top3;

            this.dom_rich_list.forEach((item, index) => {
                let _data = top3[index];
                let _dom_rank = item.getChildByName('rank');
                let _dom_name = item.getChildByName('name');
                let _dom_point = item.getChildByName('point');

                if (_data) {
                    _dom_rank.visible = true;
                    _dom_name.text = app.utils.getActiveStr(_data.userName, 9);
                    _dom_point.text = app.utils.getActiveStr(parseInt(_data.amount), 10);
                    _dom_point.visible = true;
                } else {
                    _dom_rank.visible = true;
                    _dom_name.text = '虚位以待...';
                    _dom_point.visible = false;
                }
            })
        }

        // 富豪榜和我的战绩
        renderUserAmount(data) {

            this.renderRichList(data);

            // 第一次不渲染了
            if (this.config.isFirstMyList) {
                this.config.isFirstMyList = false;
                return;
            }

            this.renderMyList(data);

        }

        // 渲染周期日周月排行
        renderRankList(response) {
            if (Number(response.code) !== 0) {
                return;
            }

            let result = [];
            response.data.forEach((item, index) => {
                let trend = Number(item.rank_trend);
                result.push({
                    rankIcon: index,
                    rankNum: {
                        text: index + 1,
                        visible: index > 2 ? true : false
                    },
                    name: app.utils.getActiveStr(item.nickname, 9),
                    point: app.utils.getActiveStr(parseInt(item.amount), 10),
                    tend: trend === 3 ? 0 : trend
                })
            })

            // 年月日公共的list
            this.list_rank_all.array = result;

            if (response.data.length === 0) {
                this.isLoadingOrContent(0);

            } else {
                this.isLoadingOrContent(2);

            }

        }

        // 我的战绩渲染
        renderMyList(data) {
            let myRewards = data.myRewards;
            let result = [];
            myRewards.forEach((item, index) => {
                result.push({
                    time: item.addTime,
                    point: {
                        text: app.utils.getActiveStr(parseInt(item.amount), 10),
                        color: item.isTreasure ? '#ffec4f' : '#fff'
                    },
                    isSelf: {
                        visible: item.isTreasure
                    }
                })
            })

            // 我的战绩
            this.list_rank_my.array = result;

            if (myRewards.length === 0) {
                // 已登录
                if (app.utils.checkLoginStatus()) {
                    this.isLoadingOrContent(0);
                } else {
                    this.isLoadingOrContent(3);
                }

            } else {
                this.isLoadingOrContent(2);

            }
        }

        // 出现
        myShow() {
            if (this.config.isFirst) {
                // 触发
                this.dispatchAction();
                this.config.isFirst = false;
            }

            this.popup();
        }


    }

    app.RankPopDialog = RankPopDialog;


}
