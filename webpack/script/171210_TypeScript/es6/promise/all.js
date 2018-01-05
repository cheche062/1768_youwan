function timeout(who) {
    return new Promise(function (resolve, reject) {
        var wait = Math.ceil(Math.random() * 4) * 1000;
        setTimeout(function () {
            if (Math.random() > 0.5) {
                resolve(who + ' inner success');
            }
            else {
                reject(who + ' inner error');
            }
        }, wait);
        console.log(who, 'wait:', wait);
    });
}

var p1 = timeout('p1');
var p2 = timeout('p2');

p1.then((success) => { console.log(success) }).catch((error) => { console.log(error) })
p2.then((success) => { console.log(success) }).catch((error) => { console.log(error) })

// 只要有一个失败那就立即触发整体失败了，两个都成功整体才成功
Promise.all([p1, p2])
    .then((...args) => {
        console.log('all success', args)
    })
    .catch((...args) => {
        console.log('someone error', args)
    })