// 阮一峰
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};

/* Promise.prototype.finally = function (callback) {
    return this.then(callback, error => { console.log(error); callback() });  
}; */


function timeout(who) {
    return new Promise(function (resolve, reject) {
        var wait = Math.ceil(Math.random() * 2) * 1000;
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

var returnThen = timeout('p1').then((success) => { console.log(success) })
var returnCatch = returnThen.catch((error) => {
    new Promise((resolve)=>{resolve()}).then(() => {console.log(error)});
})

console.log(returnThen, returnCatch)



var p1 = new Promise(function(resolve, reject) {
    
})

p1
.then(()=>{}, ()=>{})
.then(() => { }, () => { })


Promise.prototype.then = function(callbackSuccess, callbackError) {
    var _this = this;

    var returnObj = callback();

    


    return new Promise(function(resolve, reject){
        if(typeof returnObj === "Promise"){

        }else{

        }
    })
}
