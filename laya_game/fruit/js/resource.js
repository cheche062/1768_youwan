{
	const app = window.app;
	let RESOURCE = app.config.RESOURCE;

	// 字体资源
	let fonts = [
		{url: "font/bang_font.fnt", name:'bang_font', type: Laya.Loader.XML},
		{url: "font/bei_font.fnt", name:'bei_font', type: Laya.Loader.XML},
		{url: "font/car_font.fnt", name:'car_font', type: Laya.Loader.XML},
		{url: "font/ylb_font.fnt", name:'ylb_font', type: Laya.Loader.XML},
		{url: "font/award_font.fnt", name:'award_font', type: Laya.Loader.XML},
		{url: "font/room_font.fnt", name:'room_font', type: Laya.Loader.XML},
		{url: "font/xizhong_font.fnt", name:'xizhong_font', type: Laya.Loader.XML},
		{url: "font/star_font.fnt", name:'star_font', type: Laya.Loader.XML}
	];

	// loading需要的资源优先加载
	let loadingRes = [
		// load
		{ url : "load/loading_bg.jpg", type : Laya.Loader.IMAGE},
		{ url : "load/logo.png", type : Laya.Loader.IMAGE},
		{ url : "load/strip.png", type : Laya.Loader.IMAGE},
		{ url : "load/strip_bg.png", type : Laya.Loader.IMAGE},
		{ url : "load/fangcenmi.png", type : Laya.Loader.IMAGE},

		{url: 'res/atlas/load.json', type: Laya.Loader.ATLAS}
	]

	// 不打包图片资源
	let unPackRes = [
		// hall
		{ url : "hall/hallBg.jpg", type : Laya.Loader.IMAGE},

		// room
		{ url : "room/ganzi.png", type : Laya.Loader.IMAGE},
		{ url : "room/laba_bg.png", type : Laya.Loader.IMAGE},
		{ url : "room/room_bg.jpg", type : Laya.Loader.IMAGE},
		{ url : "room/clip_fruit.png", type : Laya.Loader.IMAGE},

		// pop
		{ url : "pop/bg.png", type : Laya.Loader.IMAGE},
		{ url : "pop/btn_tab.png", type : Laya.Loader.IMAGE},
		{ url : "pop/new.png", type : Laya.Loader.IMAGE},
		{ url : "pop/head.png", type : Laya.Loader.IMAGE},
		{ url : "pop/ylb/ylb_middle.png", type : Laya.Loader.IMAGE},
		{ url : "pop/help/first.png", type : Laya.Loader.IMAGE},
		{ url : "pop/help/second.png", type : Laya.Loader.IMAGE}


	];

	// 打包的json文件
	let packRes = [
		{url: 'res/atlas/comp.json', type: Laya.Loader.ATLAS},
		{url: 'res/atlas/hall.json', type: Laya.Loader.ATLAS},
		{url: 'res/atlas/room.json', type: Laya.Loader.ATLAS},
		{url: 'res/atlas/pop/ylb.json', type: Laya.Loader.ATLAS},
		{url: 'res/atlas/pop/help.json', type: Laya.Loader.ATLAS},
		{url: 'res/atlas/pop.json', type: Laya.Loader.ATLAS},

		// 骨骼动画的资源
		// 金币
		{url: 'animate/10.png', type: Laya.Loader.IMAGE},
		{url: 'animate/10.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/50.png', type: Laya.Loader.IMAGE},
		{url: 'animate/50.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/100.png', type: Laya.Loader.IMAGE},
		{url: 'animate/100.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/1000.png', type: Laya.Loader.IMAGE},
		{url: 'animate/1000.sk', type: Laya.Loader.BUFFER},

		//房间列表
		{url: 'animate/new.png', type: Laya.Loader.IMAGE},
		{url: 'animate/new.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/low.png', type: Laya.Loader.IMAGE},
		{url: 'animate/low.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/middle.png', type: Laya.Loader.IMAGE},
		{url: 'animate/middle.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/high.png', type: Laya.Loader.IMAGE},
		{url: 'animate/high.sk', type: Laya.Loader.BUFFER},

		// 房间动画
		{url: 'animate/bglight.png', type: Laya.Loader.IMAGE},
		{url: 'animate/bglight.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/star.png', type: Laya.Loader.IMAGE},
		{url: 'animate/star.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/smallAward.png', type: Laya.Loader.IMAGE},
		{url: 'animate/smallAward.sk', type: Laya.Loader.BUFFER},

		{url: 'animate/fudai.png', type: Laya.Loader.IMAGE},
		{url: 'animate/fudai.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/superAward.png', type: Laya.Loader.IMAGE},
		{url: 'animate/superAward.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/truntable.png', type: Laya.Loader.IMAGE},
		{url: 'animate/truntable.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/kuang.png', type: Laya.Loader.IMAGE},
		{url: 'animate/kuang.sk', type: Laya.Loader.BUFFER},
		{url: 'animate/buff.png', type: Laya.Loader.IMAGE},
		{url: 'animate/buff.sk', type: Laya.Loader.BUFFER}
		

	];

	// 字体
	RESOURCE.fonts = fonts;
	// 加载页资源
	RESOURCE.loadingRes = loadingRes;
	// 非加载页资源
	RESOURCE.disLoadingRes = [...unPackRes, ...packRes];

	// 总的资源
	RESOURCE.images = [...unPackRes, ...packRes, ...loadingRes];

	// 添加版本号
	let _GAME_RES = [...RESOURCE.fonts, ...RESOURCE.images];
	let GAME_VERSION = app.config.GAME_VERSION;

	let staticVertion = window.staticVertion || Date.now();
	let loop = (arr)=>{
		if( typeof arr !== 'object' ){
			return;
		}
		arr.forEach(function(item, i){
			let newUrl;
			let jsonIndex;
			let fntIndex;
			if(typeof item.url === 'string' ){
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
}