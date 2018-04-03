import Rx, { Observable } from 'rxjs/Rx';



var click$ = Rx.Observable.fromEvent(document, 'click');
// 等前一个完成在做下一个
// var source$ = click$.concatMap(() => Rx.Observable.interval(300).take(5));
// 干掉前一个
// var source$ = click$.switchMap(() => Rx.Observable.interval(300).take(5));
// 和前一个一起做
// var source$ = click$.flatMap(() => Rx.Observable.interval(300).take(5));
// 和前一个一起做
// var source$ = click$.mergeMap(() => Rx.Observable.interval(300).take(5));
// 干掉后面的
// var source$ = click$.exhaustMap(() => Rx.Observable.interval(300).take(5));



var source$ = click$
    .concatMap(
        () => Rx.Observable.interval(300).take(5),
        (outerVal, innerVal, outerIndex, innerIndex) => {
            console.log(e, res, eIndex, resIndex)

            return 'ok'
        }
    );

source$.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

// 目前的情况是连续点击后  会干掉之前未完成的流，重新开始输出：0, 1, 2, 3, 4
//  我想让它连续点击在前一个流还未完成的情况下，完全忽略后面的
//  咋搞？


// source = source.concatAll()