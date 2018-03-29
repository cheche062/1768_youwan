import { setupRxDevtools } from 'rx-devtools/rx-devtools';
import 'rx-devtools/add/operator/debug';
setupRxDevtools();


const Rx = require('rxjs/Rx');

let $input = document.getElementById("todo-val");
let $button = document.getElementById("add");
let $list = document.getElementById("list-group");

let input$ = Rx.Observable.fromEvent($input, 'keydown')
                            .filter(e => e.keyCode === 13)
let clickAdd$ = Rx.Observable.fromEvent($button, 'click');

//合并
input$ = input$.merge(clickAdd$)


//创建子项
const createTodoItem = (val) => {
    let dom = document.createElement('li');
    dom.className = "item";
    dom.innerHTML = val + '<button class="fr">删除</button>';

    return dom;
}

// 输入框文字添加item子项
const item$ = input$
    .debug('add')
    .map(() => $input.value)
    .filter(val => val !== "")
    .map(createTodoItem)
    .do(ele => {
        $list.appendChild(ele);
        $input.value = '';
    })
    .publishReplay(1)
    .refCount()

// 切换子项的完成与否
const toggle$ = item$
    .mergeMap($todoItem => {
        return Rx.Observable.fromEvent($todoItem, 'click')
            .filter(e => e.target === $todoItem)
            .mapTo($todoItem)
    })
    .do($todoItem => {
        if ($todoItem.classList.contains('done')) {
            $todoItem.classList.remove('done')
        } else {
            $todoItem.classList.add('done')
        }
    })
    

// 删除按钮事件
const remove$ = item$
    .mergeMap($todoItem => {
        let $btn = $todoItem.getElementsByTagName('button')[0];
        return Rx.Observable.fromEvent($btn, 'click')
            .mapTo($todoItem)
    })
    .do($todoItem => {
        $todoItem.parentNode.removeChild($todoItem);
    })
    

const app$ = toggle$.merge(remove$)
    .do(val => console.log(val))
    
    
app$.subscribe();


console.log('1.js66666');

