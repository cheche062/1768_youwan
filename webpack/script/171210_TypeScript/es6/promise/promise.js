function timeout() {
    return new Promise(function (resolve, reject) {
        var wait = Math.ceil(Math.random() * 4) * 1000;
        setTimeout(function () {
            if (Math.random() > 0.5) {
                resolve('success');
            }
            else {
                reject('error');
            }
        }, wait);
        console.log('wait:', wait);
    });
}
timeout()
.then(function (data) {
    console.log('成功者1： ', data);
    return timeout();
    // 失败
}, function (data) {
    console.log('失败者1：', data);
    return timeout();
})
.then(function (data) {
    console.log('成功者2： ', data);
    // 失败
}, function (data) {
    console.log('失败者2：', data);
});
