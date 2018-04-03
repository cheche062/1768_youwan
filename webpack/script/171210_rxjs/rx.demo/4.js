import Rx, { Observable } from 'rxjs/Rx';

let add$ = Observable.fromEvent(document.getElementById('add'), 'click')
    .mapTo(1)
let cut$ = Observable.fromEvent(document.getElementById('cut'), 'click')
    .mapTo(-1)


add$.merge(cut$) // 合并起来
    .scan((pre, cur) => pre + cur, 0) //累计效果 每次推送新值过来后就累计起来且以0为初始值
    .subscribe(console.log)


// const numberState = Rx.Observable.empty()
//     .merge(add$, cut$)
//     .scan((origin, next) => origin + next, 0)
//     .subscribe(console.log)

/*source.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
})*/