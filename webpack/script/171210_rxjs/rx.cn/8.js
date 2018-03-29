import Rx from 'rxjs/Rx';

//buffer

// var clicks = Rx.Observable.fromEvent(document, 'click');
/*var interval = Rx.Observable
    .interval(300);
var observable = Rx.Observable
    .fromEvent(document, 'click')
    .buffer(interval)


observable.subscribe(x => {
    if (x.length == 1) {
        console.log("单击")       
    } else if (x.length == 2) {
        console.log("双击")       

    } else if(x.length == 3) {
        console.log("三连击")       
    }
});*/



let breakWhen$ = Rx.Observable.timer(2000);

let stream$ = Rx.Observable.interval(200)
.buffer( breakWhen$ );

stream$.subscribe((data) => console.log( 'values', data ));
