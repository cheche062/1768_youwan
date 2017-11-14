;(function(global){

	global.audio = {
		loaded : false,
		soundClose : false,
		audioSources : {
			an_niu                  :       'an_niu' ,                //按钮
			bai_pai                 :       'bai_pai',                //摆拍
			dan_li                  :       'dan_li' ,                //单例比牌
			hall_bgm                :       'hall_bgm',               //大厅背景乐
			notice                  :       'notice',                 //提示出牌
			perfect                 :       'perfect',                //完美摆拍 & 全胜
			
			ping                    :       'ping',                  //平局
			room_bgm                :       'room_bgm',              //房间背景乐
			shou_pai                :       'shou_pai',              //发手牌
			shu                     :       'shu',                   //输了
			win                     :       'win',                   //赢了
			xia_jiang               :       'xia_jiang',             //比分下降合并
		},
		load : function() {
			var self = this;
			if(!self.loaded){
				self.loaded = true;
				Laya.SoundManager.setMusicVolume(1);
				Laya.SoundManager.setSoundVolume(3);
			};
			if(self.getCookie("soundClose") == 'true'){
				
				self.setMuted();
			}else{
				self.setMutedNot();
			};

		},
		play : function(id){
			var self = this;
			var src = audioSrc + self.audioSources[id] + '.mp3' ;
			if(id == 'hall_bgm' || id == 'room_bgm'){

				Laya.SoundManager.playMusic(src, 0);
			}else{

				Laya.SoundManager.playSound(src, 1);
			};
		},
		//设置静音
		setMuted : function(){
			var self = this;
			self.soundClose = true;
			Laya.SoundManager.muted = true;
		},
		//设置非静音(如果需要在播放背景音乐，需要重新play('gameBg')方法);
		setMutedNot: function(){
			var self = this;
			self.soundClose = false;
			Laya.SoundManager.muted = false;
			self.play('hall_bgm');

		},
		//停止背景音乐播放
		stopBgMusic : function(){
			var self = this;
			Laya.SoundManager.stopMusic(); //停止背景音乐

		},
		//设置cookie
		setCookie : function(cname, cvalue, exdays){
			var self = this;
			var d = new Date();
			var exdays = exdays || 7;
			d.setTime(d.getTime() + (exdays*24*60*1000));
			var expires = "expires="+d.toUTCString();
			document.cookie = cname + "=" +cvalue + ";" +expires; 
		},
		//获取cookie
		getCookie : function(cname){
			var self = this;
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i =0; i<ca.length; i++){
				var c = ca[i];
				while(c.charAt(0) ==' ') c = c.substring(1);
				if(c.indexOf(name) != -1) return c.substring(name.length, c.length);
			}
			return "";
		},
		clearCookie : function(name){
			var self = this;
			self.setCookie(name, "",-1);
		}
		
	};

})(window)