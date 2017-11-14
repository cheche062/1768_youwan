var RESOURCE_IMG = [
	{ url : "images/hhhh2.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/menu2.png", type : Laya.Loader.IMAGE},
	{ url : "images/load_line.png", type : Laya.Loader.IMAGE},
	{ url : "images/neice2.png", type : Laya.Loader.IMAGE},
	{ url : "images/progress$bar.png", type : Laya.Loader.IMAGE},
	{ url : "images/btn_kuang01.png", type : Laya.Loader.IMAGE},
	{ url : "images/fangcenmi.png", type : Laya.Loader.IMAGE},
	{ url : "images/progress.png", type : Laya.Loader.IMAGE},
	{ url : "images/rank_bg.png", type : Laya.Loader.IMAGE},
	// { url : "images/recharge_bg.png", type : Laya.Loader.IMAGE},
	{ url : "images/recharge/recharge_bg.png", type : Laya.Loader.IMAGE},
	
	{ url : "images/hhhh1.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/help_head.png", type : Laya.Loader.IMAGE},
	{ url : "images/promit_bg.png", type : Laya.Loader.IMAGE},
	{ url : "images/help1.png", type : Laya.Loader.IMAGE},
	{ url : "images/help2.png", type : Laya.Loader.IMAGE},
	{ url : "images/help3.png", type : Laya.Loader.IMAGE},
	{ url : "images/shouhuo_bgNew.png", type : Laya.Loader.IMAGE},

	{ url : "res/atlas/images.json", type : Laya.Loader.ATLAS},
	{ url : "res/atlas/comp.json", type : Laya.Loader.ATLAS},

	{ url : "font/number_font.png", type : Laya.Loader.IMAGE},
	// 房间页的资源
	{ url : "images/room_bg2.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/room/clip_numberImage.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/clip_result_light2.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/game_area.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/light_money.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/lose_icon.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/mask_bg.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/talk_bg.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/win_icon.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/vslider.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/under_line.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/vslider$bar.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/vslider$down.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/vslider$up.png", type : Laya.Loader.IMAGE},

	// 房间内弹层
	{ url : "images/room/headPop/detailed_info2.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/headPop/emotion_bg2.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/headPop/gift.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/headPop/perfect.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/headPop/perfect_bg.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/headPop/clip_dj1.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/headPop/clip_dj2.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/headPop/clip_dj3.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/headPop/clip_dj4.png", type : Laya.Loader.IMAGE},

	// 新手引导（不打包）
	{ url : "images/room/newPlayer/help0.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help01.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help1.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help2.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help3.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help4.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help5.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help6.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help8.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help9.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help15.jpg", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/help16.png", type : Laya.Loader.IMAGE},
	{ url : "images/room/newPlayer/new_3.png", type : Laya.Loader.IMAGE},

	{ url:  "res/atlas/images/room.json", type: Laya.Loader.ATLAS},
	{ url:  "res/atlas/images/keboard.json", type: Laya.Loader.ATLAS},
	{ url:  "res/atlas/images/youhua2.json", type: Laya.Loader.ATLAS},
	{ url:  "res/atlas/images/recharge.json", type: Laya.Loader.ATLAS},
	{ url:  "res/atlas/images/room/headPop.json", type: Laya.Loader.ATLAS}

]

var RESOURCE_FNT = [
	{url: "font/number_font.fnt", name:'number_font', type: Laya.Loader.XML},
	{url: "font/chinese.fnt", name:'chinese', type: Laya.Loader.XML},
	{url: "font/smallNum.fnt", name:'smallNum', type: Laya.Loader.XML},
	{url: "font/bigNum.fnt", name:'bigNum', type: Laya.Loader.XML},
	{url: "font/loseNum.fnt", name:'loseNum', type: Laya.Loader.XML},
	{url: "font/smallLose.fnt", name:'smallLose', type: Laya.Loader.XML}
];



// 添加版本号
;(function(){
	var _GAME_RES = [];
	var GAME_VERSION = ppl.GAME_VERSION = {};

	_GAME_RES = _GAME_RES.concat(RESOURCE_IMG);
	_GAME_RES = _GAME_RES.concat(RESOURCE_FNT);
	var staticVertion = ppl.staticVertion;
    var loop = function(obj){
        if( typeof obj != 'object' ){
            return;
        }
        $.each(obj, function(i, item){
            var newUrl;
            var jsonIndex;
            var fntIndex;
            if(typeof item.url == 'string' ){
                // 若加载后缀有 .json 和.fnt 的, 则连它们对应的 png一起添加了
                jsonIndex = item.url.indexOf('.json');
                fntIndex = item.url.indexOf('.fnt');
                if( jsonIndex > -1 ){
                    newUrl = item.url.substr(0, jsonIndex) + '.png';
                }else if( fntIndex > -1 ){
                    newUrl = item.url.substr(0, fntIndex) + '.png';
                }
                if( newUrl ){
                    GAME_VERSION[newUrl] = staticVertion;
                }
                GAME_VERSION[item.url] = staticVertion;
            }else{
                loop(item);
            }
        });
    }
    loop(_GAME_RES);
})();








