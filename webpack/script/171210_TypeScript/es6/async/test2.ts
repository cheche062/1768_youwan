import { type } from "os";

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

/* var gen = function* () {
    // 先读取字段
    var f1 = yield readFile('./2.json', 'utf-8');
    var key = JSON.parse(f1)[0];
    // console.log(key);

    // 读取json对象
    var f2 = yield readFile('./1.json', 'utf-8');
    console.log(JSON.parse(f2)[key]);
}; */

const asyncReadFile = async function () {
    const f1 = await readFile('../generator/2.json', 'utf-8');
    var key = JSON.parse(f1)[0];
    // console.log(key);

    const f2 = await readFile('../generator/1.json', 'utf-8');
    console.log(JSON.parse(f2)[key]);
};

asyncReadFile();