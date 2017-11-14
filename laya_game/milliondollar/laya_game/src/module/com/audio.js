import GAME_CONFIG from '../../config/config';
import { AUDIO_SOURCES } from '../../config/data';
import { observer } from '../init_module';

// 音效模块
export default class AudioMudule {
    constructor() {
        this.init();

        AudioMudule.instance = this;
    }

    static getInstance() {
        return this.instance || new this();
    }

    init() {
        Laya.SoundManager.setMusicVolume(0.3);
        Laya.SoundManager.setSoundVolume(1);

        // 声音变化
        observer.subscribe('game::voice', this.changeVoiceState.bind(this));

    }

    // 初始化加载资源（除背景乐）
    initResource() {
        AUDIO_SOURCES.forEach((item, index) => {
            if (item !== 'bg') {
                this.play(item);
            }
        })

        this.stopAllSound();
    }

    // times播放次数 0表示循环播放， 1表示播放一次
    play(id, times = 1) {
        let src = `audio/${id}.mp3?v=${GAME_CONFIG.STATIC_VERTION}`;
        if (!AUDIO_SOURCES.includes(id)) {
            console.log('没有该资源音效: ' + id);
            return;
        }

        // 背景乐必定是循环播放
        if (id === 'bg') {
            Laya.SoundManager.playMusic(src, 0);

        } else {
            Laya.SoundManager.playSound(src, times);
        }
    }

    changeVoiceState(bool){
        if(!bool){
            this.setMuted();
        }else{
            this.setMutedNot();
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

    //停止所有音效（除了背景音乐）
    stopAllSound() {
        Laya.SoundManager.stopAllSound();
    }



}
