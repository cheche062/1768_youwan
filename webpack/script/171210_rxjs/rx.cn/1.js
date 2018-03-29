import Rx from 'rxjs/Rx';

/**
 * switch switchMp switchMpTo 之间的用法差别
 * 同理 map mapTo
 *
 * @type       {<type>}
 */

var clicks = Rx.Observable.fromEvent(document, 'click');

/**
 * 第一种 switch
 */

// 每次点击事件都会映射成间隔1秒的 interval Observable
// var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
// var switched = higherOrder.switch();
// 结果是 `switched` 本质上是一个每次点击时会重新启动的计时器。
// 之前点击产生的 interval Observables 不会与当前的合并。
// switched.subscribe(x => console.log(x));


/**
 * 第二种 switchMp
 */

// var higherOrder = clicks.switchMap((ev) => Rx.Observable.interval(1000));
// higherOrder.subscribe(x => console.log(x));



/**
 * 第三种 switchMpTo
 */

var higherOrder = clicks.switchMapTo(Rx.Observable.interval(1000));
higherOrder.subscribe(x => console.log(x));