{
    window.app.audio = {
        loaded: false,
        audioSources: {
            btn_niu: 'btn_niu', //按钮
            hall_bgm: 'hall_bgm', //大厅背景乐
            smallWin: 'smallWin', //大厅背景乐
            bigWin: 'bigWin' //大厅背景乐

        },

        init() {
            let self = this;
            if (!self.loaded) {
                self.loaded = true;
                Laya.SoundManager.setMusicVolume(1);
                Laya.SoundManager.setSoundVolume(3);
            }
            if (self.getCookie("fruit_sound") === 'false') {

                self.setMuted();
            } else {
                self.setMutedNot();
            }

            // 初始化加载资源（除背景乐）
            this.initResource();

        },

        play(id) {
            let self = this;
            let src = `audio/${self.audioSources[id]}.mp3?v=${window.staticVertion}`;
            if (id == 'hall_bgm' || id == 'room_bgm') {

                Laya.SoundManager.playMusic(src, 0);
            } else {

                Laya.SoundManager.playSound(src, 1);
            }
        },

        // 初始化加载资源（除背景乐）
        initResource(){

            this.play('bigWin');
            this.play('smallWin');

            Laya.SoundManager.stopAllSound(); //停止所有音效（除了背景音乐）
        },

        //设置静音
        setMuted() {
            let self = this;
            Laya.SoundManager.muted = true;
        },

        //设置非静音(如果需要在播放背景音乐，需要重新play('gameBg')方法);
        setMutedNot() {
            let self = this;
            Laya.SoundManager.muted = false;
            self.play('hall_bgm');
        },

        //停止背景音乐播放
        stopBgMusic() {
            let self = this;
            Laya.SoundManager.stopMusic(); //停止背景音乐
        },

        //设置cookie
        setCookie(cname, cvalue, exdays=7) {
            let self = this;
            let d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires;
        },

        //获取cookie
        getCookie(cname) {
            let self = this;
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0).trim() === ''){
                	c = c.substring(1);
                } 
                if (c.indexOf(name) !== -1) {
                	return c.substring(name.length, c.length);	
                }
            }
            return "";
        },

        clearCookie(name) {
            let self = this;
            self.setCookie(name, "", -1);
        }

    }

}
