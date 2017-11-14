/*
 *  菜单只包含在头部场景中，所以菜单只在头部场景实例化
 */
{
    const app = window.app;
    const GM = window.GM;

    class HeaderScene {
        constructor(obj) {
            this.sceneName = 'headerScene';

            // 父元素传进来
            this.top_box = obj;
            this.init();
        }

        init() {

            // 提高层级
            this.top_box.zOrder = 1;

            this.initDom();

            this.initConfig();

            // 初始化事件
            this.initEvent();

            this.initSoundState();

            // 注册
            this.registerAction();

            // 是否显示返回按钮
            this.isShowBtnBackHandler();

            // 是否要显示主页按钮
            this.isShowBtnHomeHandler();

        }

        // 注册
        registerAction() {
            app.messageCenter.registerAction("userAccount", this.renderUserAmount.bind(this)) // 用户余额
                .registerAction("marquee", this.noticeMainHandler.bind(this)) // 公告
                .registerAction("losePointStatus", this.losePointStatusFn.bind(this)) // 输分禁用
                .registerAction("losePoint", this.losePointFn.bind(this)) // 输分提醒

            app.observer.subscribe('updateUserYuDou', this.updateUserYuDou.bind(this));

        }

        // 触发
        dispatchAction() {
            app.messageCenter.emitAjax("userAccount");


        }

        initDom() {
            // 声音按钮
            this.sound_btn = this.more_box.getChildByName('sound_btn');
            this.help_btn = this.more_box.getChildByName('help_btn');


        }

        initConfig() {
            this.config = {
                isFirstDefault: false, // 是否第一次默认押注金额提示
                soundStateKey: 'superstars_sound', //声音的状态
                stateSound: '', //声音的状态
                tingDou: 0,
                yuNum: 0
            }
        }

        // 初始化事件可能会在频繁remove后被移除，故在外部被add后初始化
        //直接写在内部的事件却不会被移除（疑问？？？）
        initEvent() {
            // 菜单
            this.btn_menu.on(Laya.Event.CLICK, this, () => {

                this.more_box.visible = !this.more_box.visible;
                app.audio.play('click');

            });

            // 声音
            this.sound_btn.on(Laya.Event.CLICK, this, this.changeSoundState);

            // 帮助按钮
            this.help_btn.on(Laya.Event.CLICK, this, () => {
                app.observer.publish('helpPopShow');
                this.more_box.visible = false;
                app.audio.play('click');

            });


            // 余额查询
            this.dom_yu_num.on(Laya.Event.CLICK, this, this.yuNumPopBalanceShow);

            // 充值按钮
            this.btn_chong.on(Laya.Event.CLICK, this, () => {

                // 发布
                app.observer.publish("rechargePopShow");
                app.audio.play('click');
            });


            // 点击其它区域菜单隐藏
            Laya.stage.on(Laya.Event.CLICK, this, (event) => {
                let _target = event.target;
                if (this.more_box.visible && _target !== this.btn_menu && _target !== this.more_box && !this.more_box.contains(_target)) {

                    this.more_box.visible = false;
                }
            });
        }




    }

    app.HeaderScene = HeaderScene;


}
