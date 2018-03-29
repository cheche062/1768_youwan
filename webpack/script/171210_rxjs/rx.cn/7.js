import Rx from 'rxjs/Rx';

// scan 和 reduce区别
// scan 是每次进来数据都会返回
// reduce只会返回一次（Observer成功后）
let stream$ = Rx.Observable/*.fromEvent(document, 'click')*/
    .create(observer => {
        observer.next(3)
        observer.next(6)
        observer.next(9)
        observer.complete()
    })

    // .of(3, 6, 9)
    .map(x => { return { sum: x, counter: 1 } })
    .reduce((acc, curr) => {
        return Object.assign({}, acc, { sum: acc.sum + curr.sum, counter: acc.counter + 1 })
    })
    .map(x => x.sum / x.counter)


stream$.subscribe(val => console.log(val))


// acc:  { sum: 3, counter: 1 }
// curr: { sum: 6, counter: 1 }
// { sum: 9, counter: 2 } { sum: 9, counter: 1 }
// { sum: 18, counter: 3 }
// 6