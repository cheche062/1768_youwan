function create(cb) {
    // 可观察对象
    let observable = {
        subscribe(observer) {
            cb(observer)

        }
    }


    return observable
}

let source$ = create(function(observer) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
    observer.next('still work');
})


var observer = {
    next: function(value) {
        console.log(value)
    },
    complete: function() {
        console.log('complete!')
    }
}

// 观察者订阅
source$.subscribe(observer)
