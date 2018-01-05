
function timeout() {
    return new Promise((resolve, reject) => {
        var wait: number = Math.ceil(Math.random() * 3) * 1000;
        setTimeout(() => {
            if (Math.random() > 0.5) {
                return resolve('success');
            } else {
                return reject('error');
            }
        }, wait);
        console.log('wait:', wait)
    });
}

timeout()
    // 成功
    .then((data) => {
        console.log('成功者1： ', data);
        return timeout();

        // 失败
    }, (data) => {
        console.log('失败者1：', data)
        return timeout();
    })

    // 成功
    .then((data) => {
        console.log('成功者2： ', data);

        // 失败
    }, (data) => {
        console.log('失败者2：', data)
    })

