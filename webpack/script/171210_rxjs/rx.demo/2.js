import Rx, { Observable } from 'rxjs/Rx';

// 拖拽
var domDrag = document.getElementById('drag')

var mousedown$ = Rx.Observable.fromEvent(domDrag, "mousedown")
var mousemove$ = Rx.Observable.fromEvent(document, "mousemove")
var mouseup$ = Rx.Observable.fromEvent(document, "mouseup")


mousedown$.map(() => mousemove$.takeUntil(mouseup$))
.concatAll()
.map(e => ({x: e.clientX, y: e.clientY}))
.subscribe(pos => {
    domDrag.style.left = pos.x + 'px';
    domDrag.style.top = pos.y + 'px';
})



