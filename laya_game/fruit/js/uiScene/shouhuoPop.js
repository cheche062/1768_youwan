// 收获弹层
{
    const app = window.app;
    const shouhuoPopUI = window.shouhuoPopUI;

    class ShouhuoPopUIDialog extends shouhuoPopUI {
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

        }

        initEvent() {

            // 确认收获
            this.btn_sure.on(Laya.Event.CLICK, this, () => {
                // 确认收获带出
                app.messageCenter.emit('transferToPlatform');

                this.close();
            });

            // 查看别处游戏币
            this.btn_other.on(Laya.Event.CLICK, this, () => {
                app.utils.checkOtherYxb();

                this.close();

            });

        }

        // 注册
        registerAction() {
            // 注册信息处理（渲染信息）
            app.messageCenter.registerAction("accoutDetail", this.renderContentList.bind(this));

            // 弹层挂载（出现弹层）  两者分开的原因：弹层优先出来，以防用户多次点击
            app.observer.subscribe("shouhuoPopShow", this.myShow.bind(this));

        }

        // 渲染内容
        renderContentList(data) {
            if (data.code !== 0 || data.userAccount.code !== 'success') {
                return;
            }

            let msg = data.userAccount.msg;

            // 1: '欢乐值', 2: '积分', 3: '欢乐豆', 4: '彩金', 5:'钻石', 9: '彩分', 10: '健康金', 11: '平安流量'
            let typeObj = { 1: 'hlz', 2: 'jf', 3: 'hld', 4: 'cj', 5: 'zs', 9: 'cf', 10: 'jkj', 11: 'liuliang' };

            msg.details.forEach((item) => {
                this['dom_' + typeObj[item.accountType]].text = item.amountAvailable;

                // 平安流量
                if(Number(item.accountType) === 11 && Number(item.amountAvailable) > 0){
                    this['dom_' + typeObj[11]].parent.visible = true;
                }
            });

        }

        myShow(txt) {
            // 游戏币
            this.dom_yxb.text = txt;

            this.popup();
        }


    }

    app.ShouhuoPopUIDialog = ShouhuoPopUIDialog;
}
