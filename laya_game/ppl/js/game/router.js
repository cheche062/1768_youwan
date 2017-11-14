;(function(){
	Game.router = {
		router : null,
		hasInit: false,
		init : function(){
			if(this.hasInit){
				return;
			}
			this.hasInit = true;
			var routes = {
				hall : function(){

					// 资源未加载完
					if(!Game.hasLoadedRes){
						return;
					}

					console.warn('更改root回到大厅：#/hall');
					Game.pageSwitch("hall");

					// 表示在房间内状态
					if(broker.roomUIEx.isRoomState){

						Laya.timer.once(200, this, function(){

							Game.router.navigate('room');

							broker.warnPopUIEx.show('回到未完成的牌局');
						}) 

					}else{

						// 统一初始化大厅需要做的事情
						Game.hall.goInHall();
					}

					return;

				},
				room : function(){

					// 资源未加载完
					if(!Game.hasLoadedRes){
						return;
					}

					console.warn('更改root进入房间：#/room');
					Game.pageSwitch("room");
					
					return;
				}

			};

			//初始化路由
			this.router = Router(routes);

			//初始化路由
			this.router.init();

		},

		navigate : function(path){
			this.router.setRoute(path);
		}
	};


})();