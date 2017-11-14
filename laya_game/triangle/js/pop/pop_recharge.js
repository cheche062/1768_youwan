"use strict";
//充值弹框  
(function () {

    function Rechargepopup() {
        Rechargepopup.super(this);
        this.defaultText = '请输入大于0的正整数（单位：元）';
        this.amount = ['10', '50', '100', '500'];
        this.shuoldPay = 100;
        this.init();

    }
    Laya.class(Rechargepopup, "app.Rechargepopup", ui.pop.pop_rechargeUI);
    var _proto = Rechargepopup.prototype;
    _proto.init = function () {
        this.bindEvent();

        // 订阅
        app.observer.subscribe('rechargePopShow', this.show.bind(this));
    }
    _proto.bindEvent = function () {
        this.textinput.on(Laya.Event.CLICK, this, this.handleTextInputFocus); //input框事件
        this.mschongzhi.on(Laya.Event.CLICK, this, this.mschongzhibtn);  //充值按钮点击事件
        this.tabbox.on(Laya.Event.CLICK, this, this.tabboxbtn); //tab栏点击事件
    }
    //input框选中方法
    _proto.handleTextInputFocus = function () {
        this.keybox();
                    
        app.audio.play('click');
    }
    _proto.mschongzhibtn = function () {
        var currentUrl = redirect_uri;
        var piggameId = gameId;
        var gameName = tradeName;
        var shuoldPay = this.textinput.text;
        var gameplatform = platform;
        if (this.textinput.text > 0) {
            window.location.href = '/?act=payment&gameId=' + piggameId + '&tradeName=' + gameName + '&amount=' + shuoldPay + '&platform=' + gameplatform + '&redirect_uri=' + currentUrl;
        } else {
            this.textinput.text = '请输入大于0的充值金额';
        }
        
        app.audio.play('click');
    }
    _proto.tabboxbtn = function () {
        var index = this.tabbox.selectedIndex;
        if (index == -1) {
            return;
        }
        var val = this.amount[index];
        this.textinput.text = val;
        this.shuoldPay = val;

        app.audio.play('click');
    }

    _proto.show = function () {
        this.tabbox.selectedIndex = 2;
        this.textinput.text = '100';
        this.popup();
    }
    _proto.keybox = function () {
        this.shuoldPay = this.textinput.text;
        var config = {
            "input": function (value) {
                this.textinput.text = value;
                this.tabbox.selectedIndex = -1;
                if (value == 10) {
                    this.tabbox.selectedIndex = 0;
                } else if (value == 50) {
                    this.tabbox.selectedIndex = 1;
                } else if (value == 100) {
                    this.tabbox.selectedIndex = 2;
                } else if (value == 500) {
                    this.tabbox.selectedIndex = 3;
                }
            }.bind(this),
            "close": function (type, value) {
                if (type === "confirm") {
                    this.textinput.text = value;
                }
            }.bind(this),
            length: 8
        }
        app.keyBoardNumber_ui_pop.enter('', config);
    }
})();