import Rx, { Observable } from 'rxjs/Rx';



var people = [
    { name: 'Anna', score: 100, subject: 'English' },
    { name: 'Anna', score: 90, subject: 'Math' },
    { name: 'Anna', score: 96, subject: 'Chinese' },
    { name: 'Jerry', score: 80, subject: 'English' },
    { name: 'Jerry', score: 100, subject: 'Math' },
    { name: 'Jerry', score: 90, subject: 'Chinese' },
];

var source = Rx.Observable
    .from(people)
    .zip(
        Rx.Observable.interval(300),
        (x, y) => x);

source = source
    .groupBy(person => person.name)
    .mergeMap(group => group.reduce((acc, curr) => ({
        name: curr.name,
        score: curr.score + acc.score
    })))

// source.subscribe(console.log);



// 0 1 2 3 4
const stream1 = Rx.Observable.interval(500).take(7);
stream1
    .startWith(1)
    .groupBy(i => i % 2)
    .concatAll()
    .subscribe(console.log);