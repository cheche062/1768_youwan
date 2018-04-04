import Rx, { Observable } from 'rxjs/Rx';



/*let click$ = Observable.fromEvent(document, 'click')
let subject = new Rx.Subject()

subject
    .mapTo(1)
    .scan((pre, cur) => pre + cur, 0)
    .subscribe(console.log)

click$.subscribe(subject)

subject.next()
subject.next()
subject.next()*/

var subject = new Rx.BehaviorSubject(0); // 0 為起始值
var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}

subject.subscribe(observerA);
// "A next: 0"
subject.next(1);
// "A next: 1"
subject.next(2);
// "A next: 2"
subject.next(3);
// "A next: 3"

setTimeout(() => {
    subject.subscribe(observerB); 
    // "B next: 3"
},3000)
