import Rx, { Observable } from 'rxjs/Rx';



/*var source = Rx.Observable.interval(2000).take(3);
var source2 = Rx.Observable.interval(1000).take(6);
var example = source.merge(source2);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});*/


var source = Rx.Observable.interval(1000).take(5);
var of$ = Rx.Observable.of('888');

source
    .concat(of$)
    .subscribe(console.log)


mouseDown
    .filter(e => video.classList.contains('video-fixed'))
    .map(e => mouseMove.takeUntil(mouseUp))
    .concatAll()
    .withLatestFrom(mouseDown, (move, down) => {
        return {
            x: validValue(move.clientX - down.offsetX, window.innerWidth - 320, 0),
            y: validValue(move.clientY - down.offsetY, window.innerHeight - 180, 0)
        }
    })
    .subscribe(pos => {
        video.style.top = pos.y + 'px';
        video.style.left = pos.x + 'px';
    })


mouseDown$
    .filter((e: any) => video.classList.contains('video-fixed'))
    .map((event: any) => mouseMove$.takeUntil(mouseUp$)
    }
).concatAll()
    .withLatestFrom(mouseDown$, (move: any, down: any) => {
        return {
            x: move.clientX - (down.clientX - down.target.getBoundingClientRect().left),
            y: move.clientY - (down.clientY - down.target.getBoundingClientRect().top)
        }
    })
    .subscribe(pos => {
        dragDom.style.left = pos.x + 'px';
        dragDom.style.top = pos.y + 'px'
    })


mouseDown$
    .filter((e: any) => video.classList.contains('video-fixed'))
    .map((event: any) => mouseMove$.takeUntil(mouseUp$))
    .concatAll()
    .withLatestFrom(
        mouseDown$.map(down => ({
            rect: down.target.getBoundingClientRect(),
            clientX: down.clientX,
            clientY: down.clientY
        })),
        (move: any, down: any) => {
            return {
                x: move.clientX - (down.clientX - down.rect.left),
                y: move.clientY - (down.clientY - down.rect.top)
            };
        })
    .subscribe(pos => {
        dragDom.style.left = pos.x + 'px';
        dragDom.style.top = pos.y + 'px'
    })