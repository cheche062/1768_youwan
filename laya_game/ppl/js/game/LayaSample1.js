;(function(){

	Laya.init(750, 1334);
	Laya.stage.alignH = Laya.Stage.ALIGN_CENTER; //横向居中
	Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE; //竖向居中
	Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
	Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
	Laya.URL.basePath = CDN_URL;
    Laya.URL.version = ppl.GAME_VERSION;
	
	//游戏初始化
	Game.init();

})()




