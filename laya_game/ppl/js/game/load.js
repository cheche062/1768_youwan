//加载页面
;(function(){
	Game.Load = {

		 //加载资源完毕end~
		onLoaded : function(){

			Game.hasLoadedRes = true;
			console.warn('大厅&房间————资源加载完成');

			//房间初始化
			Game.room.init();

			//大厅初始化
			Game.hall.init();

			//初始到大厅
			Game.router.navigate('hall');

		},

		//加载中滚动条
		onLoading : function(percent){
			var x = 588 * percent;
			x = x > 588? 588 : x;
			Game.LoadWrap.progress.value = percent;
		},

		//加载图片字体
		BitmapFont : function(){

			//全局字体资源
			RESOURCE_FNT.forEach(function(item, i, arr){
				var bitmapfont = new Laya.BitmapFont();
				bitmapfont.loadFont(item.url);
				Laya.Text.registerBitmapFont(item.name, bitmapfont);
			})
		},

		addIsbn: function(){
			if(GM.gamePublishInfo){
				var isbn = new laya.components.Isbn();
				Game.LoadWrap.addChild(isbn);
				
			}
		},

		init : function(){

			//加载页
			Game.pageSwitch("load");

			//初始化加载条为 0
			Game.LoadWrap.progress.value = 0;

			// 添加ISBN信息
			this.addIsbn();

			//加载字体
			this.BitmapFont();

			// RESOURCE_IMG 全局上的资源变量
			Laya.loader.load(RESOURCE_IMG, Laya.Handler.create(this, this.onLoaded), Laya.Handler.create(this, this.onLoading, null, false));
		}
	}

	//加载初始化
	Game.Load.init();

})();



