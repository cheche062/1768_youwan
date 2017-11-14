// 历史记录弹框（福袋分奖）
{
    const app = window.app;
    const historyPopUI = window.historyPopUI;

    class HistoryPopUI extends historyPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {

            // 注册
            this.registerAction();

        }

        initConfig() {
            this.config = {

            }
        }

        // 注册
        registerAction() {
            // 盈利榜
            app.messageCenter.registerAction("awardList", this.renderContentList.bind(this));

            app.observer.subscribe('historyPopShow', this.myShow.bind(this));

        }

        // 渲染内容
        renderContentList(data) {
            let array = [];

            data.award.forEach((item, index) => {
                let _name = app.utils.getActiveStr(item.nickname, 12);
                array.push({
                    bg: item.userid ? 1 : 0,
                    time: item.raw_add_time,
                    name: _name,
                    coin: item.point
                })
            })

            this.ylb_content_list.array = array;

        }

        myShow() {
            this.popup();
        }


    }

    app.HistoryPopUI = HistoryPopUI;
}
