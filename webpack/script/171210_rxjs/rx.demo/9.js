import Rx, { Observable } from 'rxjs/Rx';

import { setupRxDevtools } from 'rx-devtools/rx-devtools';
import 'rx-devtools/add/operator/debug';
setupRxDevtools();


// 输入关键字进行异步查找并排序
let input = document.getElementById('todo-val')
let input$ = Observable.fromEvent(input, 'input')

let app$ = input$
    .debug('查询')
    .debounceTime(200)
    .map(e => e.target.value)
    .switchMap(key => {
        // 随机等待时间
        let time = Math.ceil(Math.random() * 5) * 500
        console.log('time:', time)
        return Observable.create((observer) => {
            // 异步返回数据
            setTimeout(() => {
                let data = ['apple', 'banana', 'watermelon', 'mango', 'strawberry', 'pear', 'pineapple']
                observer.next(data)
            }, time)
        })
    }, (outerVal, innerVal) => {
        return innerVal.filter(item => item.includes(outerVal))
    })
    .map(data => data.sort((a, b) => a.length - b.length))
    .do(data => {
        let _html = data
            .map(item => `<li>${item}</li>`)
            .reduce((pre, cur) => pre + cur, '')

        document.getElementById('list-group').innerHTML = _html
    })

app$.subscribe(console.log);