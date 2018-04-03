import Rx, { Observable } from 'rxjs/Rx';



// var source$ = Rx.Observable.interval(500).take(3).delay(2000)


/*var source$ = Rx.Observable
    .interval(500)
    .take(3)
    .delayWhen((x) => Observable.empty().delay(2000 * x))*/


/*var source = Rx.Observable.interval(300).take(5);
var someObs = Rx.Observable.interval(1000).take(1);
var example = source
    .delayWhen(x => someObs);


example.subscribe(console.log)*/


let input$ = Observable.fromEvent(document.getElementById('todo-val'), 'input')

input$
.debounceTime(500)
.map(e => e.target.value)
.filter(val => !!val)
.subscribe(console.log)

