//配置
{
    const config = window.app.config = {};

    config.debug = true;	                                //是否开启debug模式

    config.gameWidth = 750;	                                //游戏宽度
    config.gameHeight = 1334;	                            //游戏高度
    config.screenMode = Laya.Stage.SCREEN_VERTICAL;	        //游戏垂直竖屏
    config.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;       //屏幕适配
    config.alignH = Laya.Stage.ALIGN_CENTER;                //水平居中
    config.alignV = Laya.Stage.ALIGN_MIDDLE;                //垂直居中

    //资源
    config.RESOURCE = {};
    // 游戏版本号
    config.GAME_VERSION = {};
}