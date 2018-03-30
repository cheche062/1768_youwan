import { Observable } from 'rxjs/Rx';

var total = 5;
var time = 500;


export function getStream(emitter, type) {
    let curr = 0;
    return Observable.fromEvent(emitter, type)
        .switchMap(({target}) => {

            let total = Number(target.innerHTML)

            //从1楼到10楼
            let up$ = Observable.interval(time).take(total).map(val => val + 1 + curr)
            // 从10楼到1楼
            let down$ = Observable.interval(time).take(total).map(val => total - val)

            return up$.concat(down$).do(val => curr = val)
        })
}





