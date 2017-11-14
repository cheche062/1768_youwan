// 盈利榜中奖弹层
{
	const app = window.app;
	const gainPopUI = window.gainPopUI;
	
    class GainPopUIDialog extends gainPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initDom();

            // 订阅弹层出现
            app.observer.subscribe('gainPopShow', this.myShow.bind(this));

        }

        initDom() {
            // 文字主体
            this.txt_content = this.txt_box.getChildByName('txt_content');
        }

        myShow(txt) {

            this.txt_content.text = txt;
            this.show();

            // 3秒后自动关闭
            Laya.timer.once(4000, this, () => { this.close() });
        }
    }

    app.GainPopUIDialog = GainPopUIDialog;
}
