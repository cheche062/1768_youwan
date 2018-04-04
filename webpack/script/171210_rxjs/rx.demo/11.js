import Rx, { Observable } from 'rxjs/Rx';


var source = Rx.Observable.interval(1000).take(3);

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

let subject = {
    observers: [],
    subscribe: function(o) {
        this.observers.push(o)
    },
    next: function(value) {
        this.observers.forEach(o => o.next(value))
    },
    error: function(value) {
        this.observers.forEach(o => o.error(value))
    },
    complete: function(value) {
        this.observers.forEach(o => o.complete(value))
    }
}

subject = new Rx.Subject()


subject.subscribe(observerA)

source.subscribe(subject)


setTimeout(() => {
    subject.subscribe(observerB)
}, 2100)
