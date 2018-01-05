const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve('error'), 1000)
})

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
})

p2
    .then(result => console.log('成功', result))
    .then(result => console.log('成功', result), error => console.log('失败', error))
    .then(null, error => console.log('失败', error))