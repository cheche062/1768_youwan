//工具
{
    const app = window.app;
    const GM = window.GM;
    const utils = app.utils = {};

    utils.log = (...args) => {
        app.config.debug && window.console && window.console.log(...args);
    }
    utils.warn = (...args) => {
        app.config.debug && window.console && window.console.warn(...args);
    }
    utils.info = (...args) => {
        app.config.debug && window.console && window.console.info(...args);
    }

    // 是否打印信息
    utils.initDebug = (key, val) => {
        let arr = location.search.slice(1).split('&');
        let debugFE = false;
        arr.forEach((item)=>{
            let list = item.split('=');
            if(list[0] === key && list[1] === val){
                debugFE = true;
            }
        })

        return debugFE;
    }

    //生产0-num范围的随机数
    utils.randomNumber = (num) => {
        return Math.round(Math.random() * num);
    }

    //登录
    utils.gotoLogin = () => {
        location.href = GM.userLoginUrl;
    }

    //验证登录
    utils.checkLoginStatus = () => {
        return window.token && GM.userLogged;
    }

    utils.willGotoLogin = () => {
      if(!utils.checkLoginStatus()){
        utils.gotoLogin();
      }
    }

    // 查看别处游戏币
    utils.checkOtherYxb = () => {
      if(window.GM && GM.whereYxb){
        GM.whereYxb();
      }
    }

    //获取字符串长度，支持中文
    utils.getStringLength = (str = '') => {
        return ("" + str.replace(/[^\x00-\xff]/gi,"ox")).length;
    }

    // 截取字符长度限制以内的字符
    utils.getActiveStr = (str='', total=8) => {
      let realLength = 0;
      str = String(str);
      let len = str.length;
      let result = '';
      if(len === 0){
        return '';
      }
      for(let i=0; i<len; i++){
        if(str.charCodeAt(i) > 128){
          realLength += 2;
        }else{
          realLength += 1;
        }
        if(realLength>total){
          return result + '...';
        }
        result = result + str.charAt(i);
      }
      return result;
    }




};