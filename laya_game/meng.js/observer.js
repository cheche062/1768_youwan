//观察者
(function(){
    var observerModule = app.observerModule = function(options){
        //订阅者的引用
        this.subscribers = {};
    }

    var _proto_ = observerModule.prototype;

    //发布
    _proto_.publish = function(type,data){
        var _subscribers = this.subscribers[type];
        if(_subscribers){
            for(var i = 0; i < _subscribers.length; i++){
                _subscribers[i](data);
            }
        }

        return this;
    }

    //订阅
    _proto_.subscribe = function(type,handler){
        if(this.subscribers[type] == undefined){
            this.subscribers[type] = [];
        }

        this.subscribers[type].push(handler);

        return this;
    }

    //取消订阅
    //如果传递了handler，只取消该订阅，否则取消全部订阅
    _proto_.unsubscribe = function(type,handler){
        var _subscribers = this.subscribers[type];
        if(_subscribers){
            if(handler){
                for(var i = _subscribers.length - 1; i >= 0; i--){
                    if(handler == _subscribers[i]){
                        _subscribers.splice(i,1);
                        break;
                    }
                }
            }
            else{
                for(var i = _subscribers.length - 1; i >= 0; i--){
                    _subscribers.splice(i,1);
                }
            }
        }

        return this;
    }
})();