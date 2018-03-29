import Rx from 'rxjs/Rx';

/**
 * Observable
 * 冷 热 暖
 */

// 默认是冷的（所有的订阅者都会接受到所有值，包括延迟订阅的观察者）
// publish 配上 connect 会转成热的（观察者接受值是实时的， 延迟就错过之前的值）
// .publish().refCount()转成暖的（暖的是处于冷热之间的状况）
// connect和refCount（热和暖）区别：
// 调用完publish会让Observable处于等待状态，而下面connect会让其立即触发，无论有没有被订阅，所以延迟订阅的观察者会错过前面的值，而refCount则不会让Observable立即触发（惰性），而是同原先一样，只有在被订阅时才会触发（变为热性），一旦触发则后面延迟的订阅者会错过前面的值


// 冷
// 如果是冷的 observable 的话，那么两个订阅者得到值是两份完全相同的副本
/*let liveStreaming$ = Rx.Observable.interval(1000).take(5);

liveStreaming$.subscribe(
    data => console.log('a', data),
    err => console.log(err),
    () => console.log('a completed')
)

setTimeout(() => {
    liveStreaming$.subscribe(
        data => console.log('b', data),
        err => console.log(err),
        () => console.log('b completed')
    )
}, 3000)*/


// 热
// 在这个案例中，我们看到第一个订阅者输出的是0,1,2,3,4，而第二个输出的是3,4。很明显订阅的时间点是很重要的。
// publish  返回 ConnectableObservable，它是 Observable 的变种，它会一直等待，直到 connnect 方法被调用才会开始把值发送给那些订阅它的观察者。
/*let stream$ = Rx.Observable
    .interval(1000)
    .take(4)
    .publish();


setTimeout(() => {
    stream$.subscribe(data => console.log(data))
}, 3000);

stream$.connect();*/


// 暖 (惰性的热)
/*let obs = Rx.Observable.interval(1000).take(3).publish().refCount();

setTimeout(() => {
    obs.subscribe(data => console.log('sub1', data));
},1100)

setTimeout(() => {
    obs.subscribe(data => console.log('sub2', data));
},3000)*/

// share是`.publish().refCount()｀的别名
/*let obs = Rx.Observable.interval(1000).take(3).share();

setTimeout(() => {
    obs.subscribe(data => console.log('sub1', data));
},1100)

setTimeout(() => {
    obs.subscribe(data => console.log('sub2', data));
},3000)*/