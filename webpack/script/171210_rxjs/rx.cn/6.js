import Rx from 'rxjs/Rx';



let source1 = Rx.Observable
    .interval(100)
    .map(val => "source1 " + val)
    .take(5);

let source2 = Rx.Observable
    .interval(50)
    .map(val => "source2 " + val)
    .take(2);


// 组合两个数据流，且取各自最新的数据组成数组
let stream$ = Rx.Observable.combineLatest(source1, source2);

stream$.subscribe(data => console.log(data));