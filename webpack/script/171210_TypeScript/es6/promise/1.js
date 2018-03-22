var p1 = Promise.resolve(1);
var p2 = Promise.resolve(p1);
var p3 = new Promise(function (resolve, reject) {
    resolve(p1);
});

console.log(p1 === p2)
console.log(p1 === p3)

p1.then((value) => { console.log('p1=' + value)})
p2.then((value) => { console.log('p2=' + value)})
p3.then((value) => { console.log('p3=' + value)})
