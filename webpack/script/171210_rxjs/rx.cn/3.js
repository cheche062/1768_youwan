import Rx from 'rxjs/Rx';


// var timer = Rx.Observable.of('a', 'b', 'c')
// var sequence = Rx.Observable.range(1, 10);

// concat等待前一个做完成结束后(complete)，再做下一件事，可以吧多件事连接起来做
// var result = timer.concat(sequence);


var timer = Rx.Observable.create(observer => {
    setTimeout(() => {
        observer.next('第一个a')
        observer.next('第一个b')
    }, 3000)
})

var sequence = () => {
    return Rx.Observable.create(observer => {
        setTimeout(() => {
            observer.next('第二个a')
        }, 1000)
    })
};

// concat等待前一个做完成结束后，再做下一件事，可以吧多件事连接起来有先后顺序的做
var result = timer.concatMap(sequence);


timer.subscribe(x => console.log(x));
result.subscribe(x => console.log(x));





