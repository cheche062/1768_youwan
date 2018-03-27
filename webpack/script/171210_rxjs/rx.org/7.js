import Rx from 'rxjs/Rx';

var $add = document.getElementById('add');
var $cut = document.getElementById('cut');
var $input = document.getElementById('todo-val');

//增加
var add$ = Rx.Observable.fromEvent($add, 'click')
    // 我们映射到一个函数，它会改变状态
    .map(() => state => Object.assign({}, state, { count: state.count + 1 }))

//减少
var cut$ = Rx.Observable.fromEvent($cut, 'click')
    // 我们映射到一个函数，它会改变状态
    .map(() => state => Object.assign({}, state, { count: state.count - 1 }))


// 合并(两种方式)
// var app$ = Rx.Observable.merge(add$, cut$)
var app$ = add$.merge(cut$)
    // 我们使用初始状态创建了一个对象。每当状态发生变化时，我们会接收到改变状态的函数，
    // 并把状态传递给它。然后返回新的状态并准备在下次点击后再次更改状态。
    .scan((state, changeFn) => changeFn(state), {count: 0})
    .do(state => $input.value = state.count)


//订阅
app$.subscribe()





