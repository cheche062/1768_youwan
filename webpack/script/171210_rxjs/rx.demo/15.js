import $ from 'jquery';
import Rx, { Observable } from 'rxjs/Rx';
import { setupRxDevtools } from 'rx-devtools/rx-devtools';
import 'rx-devtools/add/operator/debug';

setupRxDevtools();


const SEARCH_REPOS = 'https://api.github.com/search/repositories?sort=stars&order=desc&q=';

// 输入关键字进行异步查找并排序
let input = document.getElementById('todo-val')
let input$ = Observable.fromEvent(input, 'input')

let app$ = input$
    .debounceTime(200)
    .debug('查询')
    .map(e => e.target.value)
    .filter((text) => !!text)
    .switchMap(key => {
        return Observable.create((observer) => {
            $.ajax({
                url: SEARCH_REPOS + key,
                success: (data) => {
                    let result = data.items.map((item) => item.name)
                    observer.next(result)
                }
            })
        })
    }, (outerVal, innerVal) => {
        return innerVal.filter(item => item.includes(outerVal))
    })
    // 长度排序
    .map(data => data.sort((a, b) => a.length - b.length))
    // 清空内容
    .do(() => $('#list-group').html(''))
    // 数据转流
    .mergeMap(data => Observable.from(data))
    // 转成jq对象
    .map(item => $(`<li>${item}</li>`))
    // 添加到列表里
    .do($dom => $('#list-group').append($dom))
    // 背景颜色切换
    .mergeMap(toggleBgColor)

// 背景颜色切换
function toggleBgColor($dom) {
    let mouseover$ = Observable.fromEvent($dom, 'mouseover')
    let mouseout$ = Observable.fromEvent($dom, 'mouseout')
    let click$ = Observable.fromEvent($dom, 'click')
    click$ = click$.do((e) => {
        $(e.target).remove()
    })
    mouseover$ = mouseover$.do((e) => {
        $(e.target).css('backgroundColor', 'green')
    })
    mouseout$ = mouseout$.do((e) => {
        $(e.target).css('backgroundColor', 'white')
    })

    return mouseover$.merge(mouseout$, click$)
}

app$.subscribe(console.log);




// Observable.fromEvent($(document), 'click').subscribe(console.log)


let source$ = Observable.from([1,2,3,4])
.map(val => val + '~')
.switchMap((val) => Observable.of(val))


source$.subscribe(console.log)