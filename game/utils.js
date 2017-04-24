//工具
(function(){
    var utils = app.utils = {};

    utils.log = function(params){
        app.config.debug && window.console && window.console.log(params);
    }

    //生产0-num范围的随机数
    utils.randomNumber = function(num){
        return Math.floor(Math.random() * num);
    }

    //登录
    utils.gotoLogin = function(){
        location.href = GM.userLoginUrl;
    }

    //验证登录
    utils.checkLoginStatus = function(){
        return token && GM.userLogged;
    }

    //获取字符串长度，支持中文
    utils.getStringLength = function(str){
        return ("" + str.replace(/[^\x00-\xff]/gi,"ox")).length;
    }
})();