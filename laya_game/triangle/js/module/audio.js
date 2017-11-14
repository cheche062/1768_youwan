{
    class AudioMudule {
        constructor() {
            this.init();
        }

        init() {
            Laya.SoundManager.setMusicVolume(0.3);
            Laya.SoundManager.setSoundVolume(1);

            this.config = {
                audioSources: ['bg', 'bonus', 'change', 'click', 'coin', 'enter', 'exit', 'fantastic', 'fudai', 'line', 'perfect', 'rotate', 'win'],
                soundStateKey: `sound${GM.gameId}`, //存取声音状态的字段
                stateSound: '' //当前声音状态
            };
        }

        // 初始化加载资源（除背景乐）
        initResource() {
            this.config.audioSources.forEach((item, index) => {
                if (item !== 'bg') {
                    this.play(item);
                }
            })

            this.stopAllSound();
        }

        //停止所有音效（除了背景音乐）
        stopAllSound(){
            Laya.SoundManager.stopAllSound();
        }

        // times播放次数 0表示循环播放， 1表示博放一次
        play(id, times=1) {
            let src = `audio/${id}.mp3?v=${window.staticVertion}`;
            if (!this.config.audioSources.includes(id)) {
                return;
            }

            // 背景乐必定是循环播放
            if (id === 'bg') {
                Laya.SoundManager.playMusic(src, 0);

            } else {
                Laya.SoundManager.playSound(src, times);

            }
        }

        //设置静音
        setMuted() {
            Laya.SoundManager.muted = true;
        }

        //设置非静音(如果需要在播放背景音乐，需要重新play('gameBg')方法);
        setMutedNot() {
            Laya.SoundManager.muted = false;
            this.play('bg');
        }

        //停止背景音乐播放
        stopBgMusic() {
            Laya.SoundManager.stopMusic(); //停止背景音乐
        }

        //设置cookie
        setCookie(cname, cvalue, exdays = 7) {
            let d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires;
        }

        //获取cookie
        getCookie(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0).trim() === '') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) !== -1) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        clearCookie(name) {
            this.setCookie(name, "", -1);
        }

        // 初始化声音状态
        initSoundState(dom) {
            // 存cookie
            let _current = this.getCookie(this.config.soundStateKey);

            if (_current === 'false') {
                this.config.stateSound = 'false';
                dom.index = 1;

                // 静音
                this.setMuted();

                return;
            }

            if (_current === '') {
                this.setCookie(this.config.soundStateKey, 'true');
            }

            this.config.stateSound = 'true';
            dom.index = 0;

            // 打开声音
            this.setMutedNot();

        }

        // 改变声音状态
        changeSoundState(dom) {
            this.play('click');

            if (this.config.stateSound === 'true') {
                this.config.stateSound = 'false';
                dom.index = 1;
                this.setMuted();

            } else {
                this.config.stateSound = 'true';
                dom.index = 0;
                this.setMutedNot();
            }

            this.setCookie(this.config.soundStateKey, this.config.stateSound);
        }

    }

    app.AudioMudule = AudioMudule;

}
