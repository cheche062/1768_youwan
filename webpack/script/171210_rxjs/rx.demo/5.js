import Rx, { Observable } from 'rxjs/Rx';



/*var source = Rx.Observable.interval(300);
var source2 = Rx.Observable.interval(1000);
// var example = source.buffer(source2);
// var example = source.bufferTime(1000);
var example = source.bufferCount(3);*/


/* 首先流是 通过触发click 后开启，同时开启的是延迟500，这段时间内多次触发click会收集起来， 
const click$ = Rx.Observable.fromEvent(document, 'click')
const example$ = click$.bufferWhen(() => click$.delay(500))*/

example$.subscribe({
    next: (value) => { console.log(value.length); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});






