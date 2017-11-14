//观察者
{
    class observerModule {
        constructor(options) {
            //订阅者的引用
            this.subscribers = {};
        }

        //发布
        publish(type, ...data) {
            let _subscribers = this.subscribers[type];
            if (_subscribers) {
                for (let i = 0; i < _subscribers.length; i++) {
                    _subscribers[i](...data);
                }
            }

            return this;
        }

        //订阅
        subscribe(type, handler) {
            if (this.subscribers[type] === undefined) {
                this.subscribers[type] = [];
            }

            this.subscribers[type].push(handler);

            return this;
        }

        //取消订阅
        //如果传递了handler，只取消该订阅，否则取消全部订阅
        unsubscribe(type, handler) {
            let _subscribers = this.subscribers[type];
            if (_subscribers) {
                if (handler) {
                    for (let i = _subscribers.length - 1; i >= 0; i--) {
                        if (handler === _subscribers[i]) {
                            _subscribers.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    for (let i = _subscribers.length - 1; i >= 0; i--) {
                        _subscribers.splice(i, 1);
                    }
                }
            }

            return this;
        }
    }

    window.observerModule = observerModule;
}
