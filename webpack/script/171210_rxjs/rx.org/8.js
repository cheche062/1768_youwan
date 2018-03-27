import Rx from 'rxjs/Rx';

let subject = new Rx.Subject();

const app$ = subject.scan(val => val + 1, 0);


console.log()

