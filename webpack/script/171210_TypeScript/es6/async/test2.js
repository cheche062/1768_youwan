var fs = require('fs');

var readFile = function (fileName, option) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, option, function (error, data) {
            if (error) return reject(error);
            resolve(data);
        });
    });
};



const asyncReadFile = async function () {
    const f1 = await readFile('../generator/2.json', 'utf-8');
    var key = JSON.parse(f1)[0];

    const f2 = await readFile('../generator/1.json', 'utf-8');
    console.log(JSON.parse(f2)[key]);
};

asyncReadFile();