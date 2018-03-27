import {Observable} from 'rxjs/Rx';

let button = document.getElementById('add');
let app$ = Observable.fromEvent(button, 'click')
    .throttleTime(1000)
    .scan(count => count + 1, 0)
    .do(count => console.log(`clicked ${count} times`))


app$.subscribe()

// app$.subscribe(val => console.log(val))
