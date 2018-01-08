var fs = require('fs');
var thunkify = require('thunkify')
var readFileThunk = thunkify(fs.readFile);

function* gen() {
    var r1 = yield readFileThunk('./text1.txt', 'utf-8');
    console.log('inner r1', r1);
    var r2 = yield readFileThunk('./text2.txt', 'utf-8');
    console.log('inner r2', r2);
    var r2 = yield readFileThunk('./text2.txt', 'utf-8');
    console.log('inner r2', r2);
    var r1 = yield readFileThunk('./text1.txt', 'utf-8');
    console.log('inner r1', r1);
};

function run(fn) {
    var g = fn();
    var next = (err, data) => {
        if(err) console.log('error', err);
        var result = g.next(data);
        if (result.done) {
            console.log('全部执行完毕');
        } else {
            result.value(next);
        }
    }

    next();
}

run(gen);

// console.log('go')