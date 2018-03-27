import Rx from 'rxjs/Rx';

// 在外部产生新事件。
let subject = new Rx.Subject();
subject.subscribe(value => console.log(value))

subject.next('foo');

// 在内部产生新事件。
let observable = Rx.Observable.create(function(observer){
    observer.next('bar')
})

let app$ = observable.do(value => console.log(value))

app$.subscribe()