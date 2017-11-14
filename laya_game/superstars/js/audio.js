{
    window.app.audio = {
        loaded: false,
        audioSources: {
            bg: 'bg', // 背景音乐
            click: 'click', // 点击
            girl: 'girl', // 美女
            win: 'win', // 赢了
            lose: 'lose', // 输了
            outerStart: 'outerStart', // 外圈音效
            // Sound007: 'Sound007', // 
            // Sound015: 'Sound015', // 
            innerStart: 'innerStart' // 内圈音效
        },

        init() {
            if (!this.loaded) {
                this.loaded = true;
                Laya.SoundManager.setMusicVolume(0.3);
                Laya.SoundManager.setSoundVolume(1);
            }

            // 初始化加载资源（除背景乐）
            this.initResource();

        },

        play(id) {
            let src = `audio/${this.audioSources[id]}.mp3?v=${window.staticVertion}`;
            let volume = 1;
            if (id === 'bg') {
                Laya.SoundManager.playMusic(src, 0);

            } else {
                // 胜利声音调小
                if(id === 'win'){
                    volume = 0.5;
                }
                Laya.SoundManager.setSoundVolume(volume);
                Laya.SoundManager.playSound(src, 1);

            }
        },

        // 初始化加载资源（除背景乐）
        initResource(){
            for(let key in this.audioSources){
                if(key !== 'bg'){
                    this.play(this.audioSources[key]);
                }
            }

            Laya.SoundManager.stopAllSound(); //停止所有音效（除了背景音乐）
        },

        //设置静音
        setMuted() {
            Laya.SoundManager.muted = true;
        },

        //设置非静音(如果需要在播放背景音乐，需要重新play('gameBg')方法);
        setMutedNot() {
            Laya.SoundManager.muted = false;
            this.play('bg');
        },

        //停止背景音乐播放
        stopBgMusic() {
            Laya.SoundManager.stopMusic(); //停止背景音乐
        },

        //设置cookie
        setCookie(cname, cvalue, exdays=7) {
            let d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires;
        },

        //获取cookie
        getCookie(cname) {
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
            this.setCookie(name, "", -1);
        }

    }

}
