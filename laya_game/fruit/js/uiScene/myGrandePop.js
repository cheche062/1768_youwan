// 我的战绩弹框
{
    const app = window.app;
    const mygradePopUI = window.mygradePopUI;

    class MyGradePopUIView extends mygradePopUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initDom();

            this.initEvent();

            this.registerAction();

        }

        // 注册
        registerAction() {
            // 我的战绩信息处理
            app.messageCenter.registerAction("betPrizeList", this.renderPlayersList.bind(this));

            // 弹层出现
            app.observer.subscribe('mygradePopShow', this.myShow.bind(this));

        }


        initDom() {
            // 登录按钮
            this.btn_login = this.unLogin_box.getChildByName('btn_login');

        }

        initEvent() {
            
            // 登录按钮
            this.btn_login.on(Laya.Event.CLICK, this, () => {
                app.utils.gotoLogin();
            })

        }

        // 渲染内容
        renderPlayersList(data) {

            let array = [];

            data.list.forEach((item, index) => {
                array.push({
                    num: index + 1,
                    point: item.win_amount,
                    time: item.raw_add_time
                })
            })

            this.ylb_content_list.visible = true;
            this.unLogin_box.visible = false;
            this.ylb_content_list.array = array;

        }

        myShow() {
            // 未登录
            if (!app.utils.checkLoginStatus()) {
                this.unLogin_box.visible = true;
                this.ylb_content_list.visible = false;
            }

            this.popup();
        }


    }

    app.MyGradePopUIView = MyGradePopUIView;
}
