import {Observable, Subject} from 'rxjs/Rx';

let observable = Observable.from([1,2,3])

// 每个 Subject 都是 Observable 
// 每个 Subject 都是观察者。
let subject = new Subject()

subject.subscribe(val => console.log('A: ', val))
subject.subscribe(val => console.log('B: ', val))

// observable.subscribe(val => console.log(val))
// observable.subscribe(val => console.log(val))
observable.subscribe(subject)



// subject.next(11)
// subject.next(22)