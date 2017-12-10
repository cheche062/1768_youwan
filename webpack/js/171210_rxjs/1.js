var Rx = require('rxjs/Rx');



var observable = Rx.Observable.interval(1000);
var subscription = observable.subscribe(x => console.log(x));

// observer.subscribe(x => console.log(x))