
import { Observable } from 'rxjs/Rx';






/*const interval$ = Observable.interval(1000)
    .debug('interval')
    .startWith(10)
    .take(10)
    .filter((val) => val % 2 > 0)
    .map((val) => val * 2)
    .mergeMap(val => this.swService.getCharacters());

const other$ = Observable.interval(2000)
    .debug('second interval')
    .skip(3)
    .take(5)
    .map((val) => val * 3);

Observable.combineLatest(interval$, other$)
    .debug('combined')
    .subscribe();*/



const interval$ = Observable.fromEvent(document, 'click')
    .debug('interval')
    .map(() => 99)



interval$.subscribe()