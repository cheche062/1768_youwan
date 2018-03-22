const Rx = require('rxjs/Rx');

let observable = Rx.Observable.interval(1000);
let subscription = observable.subscribe(val => console.log(val));

setTimeout(() => {
    subscription.unsubscribe();
}, 3100);