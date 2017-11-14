// 玩家信息弹框
{
    const app = window.app;
    const playerInfoPopUI = window.playerInfoPopUI;

    class PlayerInfoPopUIView extends playerInfoPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initConfig();
            this.initDom();

            this.registerAction();
        }

        initConfig() {
            this.config = {
                baseUserHeight: 130, //玩家的一行基数高度
                baseTableHeight: 50, //下面table一行基数高度
                play_boxY: this.play_box.y, //固定的
                userRowNum: 0, //玩家行数
                tableRowNum: 0 //table行数
            }
        }

        // 注册
        registerAction() {

            app.messageCenter.registerAction("myTableList", (data) => {
                this.renderPlayersList(data);

                this.renderTableList(data);

                this.myShow();
            });

            // 挂载 (长度需要信息返回后才能确定)
            // app.observer.subscribe('playerInfoPopShow', this.myShow.bind(this));


        }

        initDom() {

        }

        // 渲染内容
        renderPlayersList(data) {
            let array = [];
            let _dataArr = data.userAmounts;

            _dataArr.forEach((item) => {
                let _head = app.utils.randomNumber(5);
                let _name = app.utils.getActiveStr(item.user_name, 12);

                array.push({
                    name: _name,
                    coin: item.winAmount,
                    head: `pop/ylb/head${_head}.png`
                })
            })

            // 玩家有几行
            this.config.userRowNum = _dataArr.length >= 6 ? 3 : Math.ceil(_dataArr.length / 2);
            this.player_list.array = array;
        }

        // 渲染table奖项
        renderTableList(data) {
            let array = [];
            let _dataArr = data.userPrize;

            _dataArr.forEach((item) => {
                let _name = app.utils.getActiveStr(item.name, 12);

                array.push({
                    time: item.time,
                    name: _name,
                    type: item.type,
                    award: item.prize
                })
            })

            this.config.tableRowNum = _dataArr.length >= 6 ? 6 : _dataArr.length;
            this.table_list.array = array;

            // 判断表格数据是否显示
            this.table_box.visible = array.length === 0 ? false : true;
        }

        // 设置各部分位置及高度
        setPositionSize() {
            let _config = this.config;
            let tableY = _config.play_boxY + _config.baseUserHeight * _config.userRowNum + 10;

            this.table_box.y = tableY;

            // 整个弹层的高度(算上table头部)
            let popHeight = tableY + _config.baseTableHeight * (_config.tableRowNum + 1) + 50;

            //  弹层的高度 = 弹层背景高度
            this.height = this.bg.height = popHeight;

        }

        myShow() {

            this.setPositionSize();

            this.popup();
        }


    }

    app.PlayerInfoPopUIView = PlayerInfoPopUIView;
}
