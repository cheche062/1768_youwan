// 帮助弹层 & 新手引导
{
	const app = window.app;
    const helpPopUI = window.helpPopUI;
	const newUserPopUI = window.newUserPopUI;
	
    class HelpPopUIDialog extends helpPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initDom();
            this.initEvent();

            // 初始化帮助页滑动效果
            new window.zsySlider(this.help_glr);

            // 订阅弹层出现
            app.observer.subscribe('helpPopShow', this.popup.bind(this));

        }

        initDom() {
        	this.close_box = this.getChildByName('close_box');
        }

        initEvent(){
        	this.close_box.on(Laya.Event.CLICK, this, this.close);

        }

    }

    class NewUserPopUIDialog extends newUserPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {

            this.initEvent();

            // 订阅弹层出现
            app.observer.subscribe('newUserPopShow', this.myShow.bind(this));

        }

        initEvent(){

            this.on(Laya.Event.CLICK, this, this.close);

        }

        myShow(txt){

            // 倍率赋值
            this.dom_room_type.text = txt;

            this.popup();
        }

    }

    app.HelpPopUIDialog = HelpPopUIDialog;
    app.NewUserPopUIDialog = NewUserPopUIDialog;
}
