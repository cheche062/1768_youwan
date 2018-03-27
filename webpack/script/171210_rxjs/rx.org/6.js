import Rx from 'rxjs/Rx';


let observable = Rx.Observable.fromEvent(document.getElementById('add'), 'click')
    .scan(count => count + 1, 0)
    .filter(val => val % 2 === 0)
    .map(val => val + ' times')
    .do(val => {
        document.getElementById('todo-val').value = val;
    })

observable.subscribe()


