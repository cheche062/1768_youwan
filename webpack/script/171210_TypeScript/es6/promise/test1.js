// 并行执行
var datum = [];
for (var i = 0; i < 10; i++) {
    datum.push(i);
}
Promise.all(datum.map(function (i) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(i * 200 + " ms 后执行结束");
            resolve("第 " + (i + 1) + " 个 Promise 执行结束");
        }, i * 200);
    });
})).then(function (data) {
    console.log('最后结果：', data);
});
