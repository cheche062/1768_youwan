// resolver为 function(resolve, reject){ ... }
function Promise(resolver) {
    if (resolver && typeof resolver !== 'function') { throw new Error('Promise resolver is not a function') }
    //当前promise对象的状态
    this.state = PENDING;
    //当前promise对象的数据（成功或失败）
    this.data = UNDEFINED;
    //当前promise对象注册的回调队列
    this.callbackQueue = [];
    //执行resove()或reject()方法
    if (resolver) executeResolver.call(this, resolver);

    // 用于执行 new Promise(function(resolve, reject){}) 中的resove或reject方法
    function executeResolver(resolver) {
        //[标准 2.3.3.3.3] 如果resove()方法多次调用，只响应第一次，后面的忽略
        var called = false,
            _this = this;

        function onError(value) {
            if (called) { return; }
            called = true;
            //[标准 2.3.3.3.2] 如果是错误 使用reject方法
            executeCallback.bind(_this)('reject', value);
        }

        function onSuccess(value) {
            if (called) { return; }
            called = true;
            //[标准 2.3.3.3.1] 如果是成功 使用resolve方法
            executeCallback.bind(_this)('resolve', value);
        }
        // 使用try...catch执行
        //[标准 2.3.3.3.4] 如果调用resolve()或reject()时发生错误，则将状态改成rejected，并将错误reject出去
        try {
            resolver(onSuccess, onError);
        } catch (e) {
            onError(e);
        }
    }

    // 用于执行成功或失败的回调 new Promise((resolve, reject) => { resolve(1)或 reject(1) })
    function executeCallback(type, x) {
        var isResolve = type === 'resolve',
            thenable;
        // [标准 2.3.3] 如果x是一个对象或一个函数
        if (isResolve && (typeof x === 'object' || typeof x === 'function')) {
            //[标准 2.3.3.2]
            try {
                thenable = getThen(x);
            } catch (e) {
                return executeCallback.bind(this)('reject', e);
            }
        }
        if (isResolve && thenable) {
            executeResolver.bind(this)(thenable);
        } else {
            //[标准 2.3.4]
            this.state = isResolve ? RESOLVED : REJECTED;
            this.data = x;
            this.callbackQueue && this.callbackQueue.length && this.callbackQueue.forEach(v => v[type](x));
        }
        return this;
    }

    function getThen(obj) {
        var then = obj && obj.then;
        if (obj && typeof obj === 'object' && typeof then === 'function') {
            return function appyThen() {
                then.apply(obj, arguments);
            };
        }
    }
}
Promise.prototype.then = function(onResolved, onRejected) {
    //[标准 2.2.1 - 2.2.2] 状态已经发生改变并且参数不是函数时，则忽略
    if (typeof onResolved !== 'function' && this.state === RESOLVED ||
        typeof onRejected !== 'function' && this.state === REJECTED) {
        return this;
    }
    // 实例化一个新的Promise对象
    var promise = new this.constructor();
    // 一般情况下，状态发生改变时，走这里
    if (this.state !== PENDING) {
        var callback = this.state === RESOLVED ? onResolved : onRejected;
        // 将上一步 resolve(value)或rejecte(value) 的 value 传递给then中注册的 callback
        // [标准 2.2.4] 异步调用callback
        executeCallbackAsync.bind(promise)(callback, this.data);
    } else {
        // var promise = new Promise(resolve=>resolve(1)); promise.then(...); promise.then(...); ...
        // 一个实例执行多次then, 这种情况会走这里 [标准 2.2.6]
        this.callbackQueue.forEach(v => v[type](x));
    }

    // 用于异步执行 .then(onResolved, onRejected) 中注册的回调
    function executeCallbackAsync(callback, value) {
        var _this = this;
        setTimeout(function() {
            var res;
            try {
                res = callback(value);
            } catch (e) {
                return executeCallback.bind(_this)('reject', e);
            }
            if (res !== _this) {
                return executeCallback.bind(_this)('resolve', res);
            } else {
                return executeCallback.bind(_this)('reject', new TypeError('Cannot resolve promise with itself'));
            }
        }, 1)
    }

    // 返回新的实例 [标准 2.2.7]
    return promise;
}







/**
 * 
 * @param {*} resolver 
 */
function Promise(resolver) {
    this.resolver = resolver;
}

Promise.prototype.then = function(success, error) {
    this.resolver(success, error)
}

new Promise(function(resolve, reject) {
        resolve();
    })
    .then(function() {

    }, function() {

    })