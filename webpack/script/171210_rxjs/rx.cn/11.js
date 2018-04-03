import Rx from 'rxjs/Rx';


let stream$ = Rx.Observable.create((observer) => {
    observer.next({});

    setTimeout(() => {
        observer.complete();
    }, 100)
}).share()

stream$.subscribe((data) => console.log('subscriber 1', data));
stream$.subscribe((data) => console.log('subscriber 2', data));





/*let obs1 = new Rx.Subject();

obs1.subscribe(val => console.log(val))
obs1.subscribe(val => console.log(val))


obs1.next({})*/
