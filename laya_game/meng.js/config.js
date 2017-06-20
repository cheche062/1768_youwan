var app = this.app || {};

//配置
(function(){
    var config = app.config = {};

    config.debug = true;	                                //是否开启debug模式

    config.gameWidth = 1334;	                            //游戏宽度
    config.gameHeight = 750;	                            //游戏高度
    config.screenMode = Laya.Stage.SCREEN_HORIZONTAL;	    //游戏自动横屏
    config.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;        //屏幕适配
    config.alignH = Laya.Stage.ALIGN_CENTER;                //水平居中
    config.alignV = Laya.Stage.ALIGN_MIDDLE;                //垂直居中

    //资源
    config.resources = {};
})();