{
    class ErrorManager {
        constructor () {}
        checkError (cmd, data, code, errormsg, type){
            if(type == "ajax"){
                //ajax网络异常，包含超时和所有异常
                if(cmd == "xhr.error"){
                    this.dispathError("xhrError");
                    return true;
                }

                //系统维护
                if(data.maintain_code == 1){
                    this.dispathError("maintain");
                    return true;
                }

                //防沉迷
                if(GM.addict && GM.addict(data)){
                    this.dispathError("addict");
                    return true;
                }

                //根据不同的错误码处理不同的异常
                var statusCode = data.statusCode;
                if(statusCode && statusCode != "0000"){
                    //error
                    this.dispathError(statusCode, errormsg);
                    return true;
                }
            }else{//socket错误
                if(code){
                    this.dispathError(code, errormsg);
                    return true;
                }
            }

            return false;
        }
        dispathError (code, msg) {
            switch(code){
                //系统维护
                case "maintain" :
                    location.reload();
                    break;
                //未登录或token丢失
                case "100" : 
                case "003" :
                case "121" : 
                    location.href = GM.userLoginUrl;
                    break;
                //otp
                case "81" :
                    location.href = "/?act=otp&st=otpPage";
                    break;
                //防沉迷
                case "addict" : 
                    //todo 清理游戏结果
                    break;
                //黑名单输分禁用
                case "99999" :
                    //todo 清理游戏结果
                    GM.jumpToHomePage && GM.jumpToHomePage("blacklist_disable"); 
                    break;            
                //异地登录
                case "1002" : 
                    //todo 提示异地登录，并且关闭当前连接
                    break;
                //余额不足
                case "1100" : 
                case "5" : 
                case "221" : 
                    //todo 提示余额不足，之后是否要弹出充值框请自行决定
                    break;
                //积分达到单笔上限提示
                case "51" : 
                case "113" : 
                    //todo 提示土豪，您投币金额达到万里通单笔限额，请往万里通设置！
                    break;
                //积分达到当日上限提示
                case "52" : 
                case "114" :
                    //todo 提示积分或欢乐值超过当日最大使用额度，若要继续游戏，请充值欢乐豆！
                    break;
                //单款游戏禁用
                case "405" : 
                case "408" :
                    //todo 提示用户 
                    break;
                //账户禁用
                case "236" : 
                    //todo 提示用户 很抱歉！经系统检测，您的账号存在异常，无法进行该游戏。如有疑问，请联系客服：4001081768。
                    break;
                //ajax网络异常，包含超时和所有异常
                case "xhrError" : 
                    //todo 一般弹窗提示 网络异常，请检查您的网络！
                    break;
                default : 
                    //todo 提示默认的错误信息
                    break;
            }
        }
    }
    
    Sail.class(ErrorManager, "Sail.Error");
}