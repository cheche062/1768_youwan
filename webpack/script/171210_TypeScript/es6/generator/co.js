var co = require('co');
var fs = require('fs');

var readFile = function (fileName, option) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, option, function (error, data) {
            if (error) return reject(error);
            resolve(data);
        });
    });
};

var gen = function* () {
    // 先读取字段
    var f1 = yield readFile('./2.json', 'utf-8');
    var key = JSON.parse(f1)[0];
    // console.log(key);
    
    // 读取json对象
    var f2 = yield readFile('./1.json', 'utf-8');
    console.log(JSON.parse(f2)[key]);
};

/* co(gen).then(function () {
    console.log('Generator 函数执行完成');
}); */

/* var g = gen();
g.next().value.then((data) => {
    g.next(data).value.then((data) => {
        g.next(data);
    })
}) */

function run(fn) {
    var g = fn();

    var next = (data) => {
        var result = g.next(data);
        if (result.done) {
            console.log('执行完毕');
        } else {
            result.value.then(next);
        }
    }

    next();
}

run(gen);
