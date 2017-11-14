// loading页
import UTILS from '../config/utils.js';
import { observer, setViewCenter } from '../module/init_module.js';

export default class LoadingScene extends window.loadUI {
    constructor() {
        super();

        this.sceneName = "loadingScene";
        this.init();
        LoadingScene.instance = this;
    }

    static getInstance(){
        return this.instance || new this();
    }

    //初始化
    init() {
        this.initConfig();
        this.renderProcessData(this.config.MIN_WIDTH, '加载中...10%');

        //订阅场景加载事件，请注意bind方法似乎会改变function，导致取消订阅的时候判断的回调函数和绑定的回调函数不相同
        observer.subscribe(this.sceneName + "_enter", this.onEnter.bind(this));
    }

    onEnter() {

        // 视图居中
        setViewCenter();

        UTILS.log(this.sceneName + " enter");

        //取消订阅时不用传递回调函数
        observer.unsubscribe(this.sceneName + "_enter");

    }

    // 初始化配置
    initConfig() {
        this.config = {};
        this.config.MAX_WIDTH = 1030;
        this.config.MIN_WIDTH = 60;

    }

    // 加载运动条
    loading(percent) {
        let per = Math.floor(percent * 100);
        let w = per / 100 * this.config.MAX_WIDTH;
        w = w < this.config.MIN_WIDTH ? this.config.MIN_WIDTH : w;
        
        this.renderProcessData(w, `加载中...${parseInt(per)}%`);
    }

    renderProcessData(width, txt){
        this.load_img.width = width;
        this.load_txt.text = txt;
    }

    // 退出场景
    onExit() {
        this.dom_skele.stop();

        UTILS.log(this.sceneName + " exit");

        //发布退出事件
        observer.publish(this.sceneName + "_exit");

        this.clear();
    }

    //自定义方法，场景退出的时候是销毁还是removeself请自行抉择
    clear() {
        this.destroy(true);
        
    }

}
