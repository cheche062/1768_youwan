import Rx, { Observable } from 'rxjs/Rx';

/////////////////////////////////////////////////
// .multicast(new Rx.Subject()) === .publish() //
/////////////////////////////////////////////////

//////////////////////////////////////////////////////////
// .publish().refCount() === .publish() \n\n .connect() === .share() //
//////////////////////////////////////////////////////////


/*var source = Rx.Observable.interval(1000)
             .take(3)
             .multicast(new Rx.Subject());

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


source.subscribe(observerA); // subject.subscribe(observerA)

source.connect(); // source.subscribe(subject)

setTimeout(() => {
    source.subscribe(observerB); // subject.subscribe(observerB)
}, 1100);*/



let source$ = Observable.interval(200).take(5)
    .map(() => Math.floor(Math.random() * 10))
    // .share()
    .publish()
    .refCount()


source$.subscribe(console.log.bind(null, 'A'))
source$.subscribe(console.log.bind(null, 'B'))
