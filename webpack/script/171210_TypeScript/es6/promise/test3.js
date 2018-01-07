var promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve('Hello World!');
    }, 1000);
});
promise.then(function () {
    promise.then().then(null).then('呵呵哒').then(function (res) {
        console.log(res);
    });
    promise["catch"]()["catch"](null).then('呵呵哒').then(function (res) {
        console.log(res);
    });
});
