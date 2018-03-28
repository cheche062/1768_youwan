import Rx from 'rxjs/Rx';


// var timer = Rx.Observable.of('a', 'b', 'c')
// var sequence = Rx.Observable.range(1, 10);

// concat等待前一个做完成结束后，再做下一件事，可以吧多件事连接起来做
// var result = timer.concat(sequence);




var timer = Rx.Observable.of('a', 'b', 'c')
var sequence = () => {
    return Rx.Observable.create(observer => {
        setTimeout(() => {
            observer.next('第二个')
        }, 2000)
    })
};

// concat等待前一个做完成结束后，再做下一件事，可以吧多件事连接起来做
var result = timer.concatMap(sequence);


result.subscribe(x => console.log(x));





