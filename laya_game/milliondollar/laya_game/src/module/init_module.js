import GAME_CONFIG from '../config/config';
import UTILS from '../config/utils';
import { AJAX_URL } from '../config/data';

import { MessageCenterModule } from './com/messageCenter';
import { ObserverModule } from './com/observer';
import { SceneManagerModule } from './com/sceneManager';

import RoomScene from '../uiScene/room';

// 进房间
function enterRoom(messageCenter) {
    let roomscene = RoomScene.getInstance(messageCenter);
    
    // 直接进房间
    if(sceneManager.currentScene !== roomscene){
        sceneManager.loadScene(roomscene);
    }
}

// 错误信息处理
function conError(data) {
    switch (Number(data.code)) {
        // 异地登陆
        case 1003:
            let reload = () => { window.location.reload() };

            // 断开连接
            messageCenter.disconnectSocket();

            // 提示弹层
            observer.publish('common::tips', '异地登录，请刷新页面', reload, reload);

            break;
    }
}

// 模块初始化
let param = {
    websocketurl: window.websocketurl,
    lib: typeof window.Primus === "undefined" ? "socketio" : "primus", //io就是socketio的namespace    //是false
    publicKey: typeof window.publicKey === "undefined" ? "" : window.publicKey,   //是false
    token: window.token,
    ajaxUrl: AJAX_URL,
    endCallBack: () => {
        let cb = () => { window.location.reload() };
        let txt = '网络断开，确定后重试。';
        observer.publish('common::tips', txt, cb);
        observer.publish('game::reset');
    },
    unLoginCallBack: () => {
        // 未登录情况下无法知道sokcet已连接
        if (!UTILS.checkLoginStatus()) {
            // 进房间
            enterRoom(messageCenter);
            console.log('open~~~未登录。。。');
        }
    },
    // 打印信息
    logInfo: (parsedData)=>{
        // 公告不展开
        if (parsedData.cmd === "bet") {
            UTILS.log("接收数据：===>", parsedData.cmd, JSON.stringify(parsedData, null, 4));

        } else {
            UTILS.log("接收数据：===>", parsedData.cmd, parsedData);
        }
    }

}

// 本地
if(GAME_CONFIG.localStatus){
    for(let key in param.ajaxUrl){
        param.ajaxUrl[key] = window.DEV_URL + param.ajaxUrl[key];
    }
}

// 通信
export const messageCenter = new MessageCenterModule(param);

// 绑定消息
messageCenter.initAction = function() {
    //一切请求等待首次连接后在发出 
    this.registerAction("conn::init", () => {
        // 进房间
        enterRoom(this);

    });

    // 连接错误信息处理
    this.registerAction('conn::error', (data) => {
        conError(data);

    });
}

// 场景切换的观察者
export const observer = new ObserverModule();

// 场景切换
export const sceneManager = new SceneManagerModule();

// 设置视图居中
export function setViewCenter() {
    let _height = Laya.stage.height;
    let currentView = sceneManager.currentScene;
    if (currentView) {
        currentView.height = _height;
    }
}


