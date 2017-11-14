// 大奖小奖弹层动画
{
    const app = window.app;
    const smallAwardPopUI = window.smallAwardPopUI;
    const superAwardPopUI = window.superAwardPopUI;

    // 小奖
    class SmallAwardPop extends smallAwardPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {
            this.initDom();

            this.zOrder = 2;

            this.bg_DB.stop();

            // 订阅弹层出现
            app.observer.subscribe('smallAwardPopShow', this.myShow.bind(this));

        }

        initDom() {
            // 动画背景
            this.bg_DB = this.getChildByName('bg_DB');
            // 文本dom
            this.dom_text = this.getChildByName('dom_text');

            // 喜中多少倍
            this.dom_bei = this.xizhong_box.getChildByName('dom_bei');
            this.dom_num = this.xizhong_box.getChildByName('dom_num');

        }

        myShow(txt) {
            this.bg_DB.once(Laya.Event.STOPPED, this, this.myClose);

            // 中奖金额数据写入
            this.dom_text.text = txt;

            this.x = (Laya.stage.width - this.width) / 2;
            this.y = (Laya.stage.height - this.height) / 2 + 120;

            // 喜中多少倍居中
            this.setXiZhongCenter(txt);

            Laya.stage.addChild(this);

            this.bg_DB.play('start', false);
            

        }

        // 喜中多少倍居中
        setXiZhongCenter(txt){
            this.dom_num.text = Math.floor(Number(txt) / Number(app.gameConfig.baseCoin));
            this.dom_bei.x = this.dom_num.x + this.dom_num.displayWidth;

        }

        myClose(){
            this.bg_DB.stop();

            this.removeSelf();
        }

    }

    // 超级大奖
    class SuperAwardPop extends superAwardPopUI {
        constructor() {
            super();

            this.init();

        }

        init() {

            this.initDom();

            this.dom_blue_bg.visible = false;

            this.bg_DB.stop();

            // 订阅弹层出现
            app.observer.subscribe('superAwardPopShow', this.myShow.bind(this));

        }

        initDom() {
            // 动画背景
            this.bg_DB = this.getChildByName('bg_DB');
            // 文本dom
            this.dom_text = this.getChildByName('dom_text');

            // 喜中倍数
            this.dom_bei = this.xizhong_box.getChildByName('dom_bei');
            this.dom_num = this.xizhong_box.getChildByName('dom_num');

        }

        myShow(txt) {
            // 绑定一次
            this.bg_DB.once(Laya.Event.STOPPED, this, ()=>{
                this.bg_DB.play('loop', true);
                Laya.timer.once(2500, this, this.myClose); 
            })

            // 中奖金额数据写入
            this.dom_text.text = txt;

            this.setXiZhongCenter(txt);

            this.popup();

            this.bg_DB.play('start', false);

        }

        // 喜中多少倍居中
        setXiZhongCenter(txt){
            this.dom_num.text = Math.floor(Number(txt) / Number(app.gameConfig.baseCoin));
            this.dom_bei.x = this.dom_num.x + this.dom_num.displayWidth;

        }

        myClose(){
            this.bg_DB.stop();
            this.close();
        }

    }


    app.SmallAwardPop = SmallAwardPop;
    app.SuperAwardPop = SuperAwardPop;
}
