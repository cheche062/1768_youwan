new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('a');
    }, 1000);
}).then(function (value) {               
    console.log("第一个" + value);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(value + 'b');
        }, 1000);
    })
}).then(function (value) {              
    console.log("第二个" + value);
}).then(function (value) {              
    console.log("第三个" + value);
})


