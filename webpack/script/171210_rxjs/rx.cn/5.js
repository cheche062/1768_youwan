import Rx from 'rxjs/Rx';

//map,flatMap和flatMapLatest

//flatMap用于打平Observable，
//flatMapLatest如果之前的Observable还没有未触发，而又收到了新的Observable，flatMapLatest会取消之前的Observable，只处理最新收到的Observable，这样就保证了处理请求的先后顺序，flatMapLatest在RxJS 5.x中已更名为switchMap。
let observable = Rx.Observable
    .interval(500)
    .take(5)
    .flatMap((n) => {
        return Rx.Observable.timer(2000)
            .map(() => n)
    });


observable.subscribe(val => console.log('me: ', val))

