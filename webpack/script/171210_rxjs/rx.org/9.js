import Rx from 'rxjs/Rx';

// 初始化状态
let inintState = {name:"cheche", count: 0};

// 数据往下流
let subject = new Rx.Subject();

// 添加数据处理的操作，注意添加到了observable身上也就是说只有对observable订阅才执行，对subject订阅没有该数据操作
// subject和observable是两个独立的 Rx被观察对象
let observable = subject.scan((state, val) => Object.assign(state, val), inintState);

//订阅器 通过该对象可解除订阅
let subscriptionA = observable.subscribe(state => console.log('A: ', state))

let subscriptionB = observable.subscribe(state => console.log('B: ', state))

//数据并没有流进scan方法
let subscriptionC = subject.subscribe(state => console.log('C: ', state))

//数据流动
subject.next({count: 1})
subject.next({name: "meihao"})

// 取消订阅
subscriptionB.unsubscribe();
subject.next({count: 2})






