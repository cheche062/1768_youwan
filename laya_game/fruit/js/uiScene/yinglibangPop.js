// 盈利榜弹框
{
    const app = window.app;
    const yinglibangPopUI = window.yinglibangPopUI;

    class YinglibangPopUIView extends yinglibangPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initConfig();
            this.initDom();

            this.initEvent();

            // 注册
            this.registerAction();

        }

        initConfig() {
            this.config = {

            }
        }

        initDom() {

            // 盈利榜奖励总金额
            this.dom_coin_num = this.ylb_top_box.getChildByName('coin_num');
            // 倒计时
            this.dom_time = this.ylb_top_box.getChildByName('time');

            // 万
            this.dom_text_wan = this.ylb_bottom_box.getChildByName('text_wan');
            this.dom_text_wan.visible = false;
            
            // 金额
            this.dom_ylb_cond = this.ylb_bottom_box.getChildByName('ylb_cond');

            // 历史记录
            this.dom_btn_history = this.ylb_bottom_box.getChildByName('btn_history');

            // 登录按钮
            this.btn_login = this.unLogin_box.getChildByName('btn_login');

        }

        initEvent() {
            // 历史记录
            this.dom_btn_history.on(Laya.Event.CLICK, this, () => {
                app.messageCenter.emit("awardList");

                app.observer.publish('historyPopShow');
            });

            // 登录按钮
            this.btn_login.on(Laya.Event.CLICK, this, () => {
                app.utils.gotoLogin();
            })
        }

        // 注册
        registerAction() {
            // 盈利榜
            app.messageCenter.registerAction("profixRank", (data) => {
                // 渲染自己
                this.renderMyself(data.myRank);

                this.renderContentList(data.rank);

                // 分奖倒计时
                this.renderTime(data.datetime);

                // 累计赢取多少万
                this.renderCond(data.cond);

                // 盈利榜金额
                if (app.gameConfig.pool) {
                    this.dom_coin_num.text = app.gameConfig.pool;
                }

            });

            // 挂载弹层
            app.observer.subscribe('yinglibangPopShow', this.myShow.bind(this));


        }

        // 渲染内容
        renderContentList(rank) {
            let array = [];
            rank.forEach((item) => {
                let _name = app.utils.getActiveStr(item.name, 12);
                array.push({
                    bg: 0,
                    rank: item.rank,
                    crown: item.rank - 1,
                    name: _name,
                    coin: item.award,
                    award: `福袋${item.percent}%奖励`
                })
            })

            this.ylb_content_list.array = array;
        }

        // 渲染自己
        renderMyself(data) {
            // 未登录
            if(Object.keys(data).length === 0){
                this.unLogin_box.visible = true;

                return;
            }
            // 已登录
            this.my_self_box.visible = true;
            let _name = app.utils.getActiveStr(data.name, 12);
            let _str = data.rank;
            if (String(_str).indexOf('>') > -1) {
                _str = data.rank.slice(1);
            }

            this.my_self_box.dataSource = {
                bg: 1,
                rank: data.rank,
                crown: Number(_str) - 1,
                name: _name,
                coin: data.award,
                award: Number(data.percent) === 0 ? '' : `福袋${data.percent}%奖励`
            }

        }

        // 分奖倒计时
        renderTime(datetime) {
            this.dom_time.text = datetime;
        }

        // 累计赢取多少万
        renderCond(cond) {
            let _cond = this.dom_ylb_cond;
            _cond.text = cond;
            this.dom_text_wan.x = _cond.x + _cond.displayWidth;

        }

        myShow() {
            this.popup();
        }


    }

    app.YinglibangPopUIView = YinglibangPopUIView;
}
