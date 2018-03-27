Rx
====================



[Observable详解](https://segmentfault.com/a/1190000008809168#articleHeader17)

在介绍 Observable 之前，我们要先了解两个设计模式，这两个模式是 Observable 的基础：

* Observer Pattern - (观察者模式)
* Iterator Pattern - (迭代器模式)

**Observer Pattern**
> 观察者模式是软件设计模式的一种。在此种模式中，一个目标对象管理所有相依于它的观察者对象，并且在它本身的状态改变时主动发出通知。这通常透过呼叫各观察者所提供的方法来实现。此种模式通常被用来实时事件处理系统。 — 维基百科

观察者模式又叫发布订阅模式（Publish/Subscribe），它定义了一种一对多的关系，让多个观察者对象同时监听某一个主题对象，这个主题对象的状态发生变化时就会通知所有的观察者对象，使得它们能够自动更新自己。


Iterator Pattern
**迭代器模式定义:**
> 迭代器（Iterator）模式，又叫做游标（Cursor）模式。它提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。

### Observable
RxJS 是基于观察者模式和迭代器模式以函数式编程思维来实现的。RxJS 中含有两个基本概念：Observables 与 Observer。Observables 作为被观察者，是一个值或事件的流集合；而 Observer 则作为观察者，根据 Observables 进行处理。
Observables 与 Observer 之间的订阅发布关系(观察者模式) 如下：

* 订阅：Observer 通过 Observable 提供的 subscribe() 方法订阅 Observable。
* 发布：Observable 通过回调 next 方法向 Observer 发布事件。

### 自定义 Observable
如果你想真正了解 Observable，最好的方式就是自己写一个。其实 Observable 就是一个函数，它接受一个 Observer 作为参数然后返回另一个函数。

**它的基本特征：**

* 是一个函数
* 接受一个 Observer 对象 (包含 next、error、complete 方法的对象) 作为参数
* 返回一个 unsubscribe 函数，用于取消订阅

**它的作用：**
作为生产者与观察者之间的桥梁，并返回一种方法来解除生产者与观察者之间的联系，其中观察者用于处理时间序列上数据流。


### Rx.Observable.create

```js
var observable = Rx.Observable
    .create(function(observer) {
        observer.next('Semlinker'); // RxJS 4.x 以前的版本用 onNext
        setTimeout(() => {
            observer.next('RxJS Observable');
        }, 300);
    });
    
// 订阅这个 Observable    
observable.subscribe(function(value) {
    console.log(value);
});
```

### Subscription
有些时候对于一些 Observable 对象 (如通过 interval、timer 操作符创建的对象)，当我们不需要的时候，要释放相关的资源，以避免资源浪费。针对这种情况，我们可以调用 Subscription 对象的 unsubscribe 方法来释放资源。具体示例如下：
```js
var source = Rx.Observable.timer(1000, 1000);

// 取得subscription对象
var subscription = source.subscribe(function(value) {
        console.log(value);
);

setTimeout(() => {
    subscription.unsubscribe();
}, 5000);
```


### Observable vs Promise