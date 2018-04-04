// 模拟一个Observable
class SafeObserver {
    constructor(destination) {
        this.destination = destination;
    }

    next(value) {
        // 尚未取消订阅，且包含next方法
        if (!this.isUnsubscribed && this.destination.next) {
            try {
                this.destination.next(value);
            } catch (err) {
                // 出现异常时，取消订阅释放资源，再抛出异常
                this.unsubscribe();
                throw err;
            }
        }
    }

    error(err) {
        // 尚未取消订阅，且包含error方法
        if (!this.isUnsubscribed && this.destination.error) {
            try {
                this.destination.error(err);
            } catch (e2) {
                // 出现异常时，取消订阅释放资源，再抛出异常
                this.unsubscribe();
                throw e2;
            }
            this.unsubscribe();
        }
    }

    complete() {
        // 尚未取消订阅，且包含complete方法
        if (!this.isUnsubscribed && this.destination.complete) {
            try {
                this.destination.complete();
            } catch (err) {
                // 出现异常时，取消订阅释放资源，再抛出异常
                this.unsubscribe();
                throw err;
            }
            this.unsubscribe();
        }
    }

    unsubscribe() { // 用于取消订阅
        this.isUnsubscribed = true;
        if (this.unsub) {
            this.unsub();
        }
    }
}


class Observable {
    constructor(_subscribe) {
        this._subscribe = _subscribe;
    }

    subscribe(observer) {
        const safeObserver = new SafeObserver(observer);
        safeObserver.unsub = this._subscribe(safeObserver);
        return safeObserver.unsubscribe.bind(safeObserver);
    }

    map(project) {
        return new Observable((observer) => {
            const mapObserver = {
                next: (x) => observer.next(project(x)),
                error: (err) => observer.error(err),
                complete: () => observer.complete()
            };
            return this.subscribe(mapObserver);
        });
    };
}

let observable = new Observable(function(observer){
    observer.next(1)
    observer.next(1)
    observer.next(1)

    return //解除的方法
})

let subscribsion = observable
    .map(val => val + 1)
    .map(val => val + 1)
    .subscribe({
        next: console.log
    })

//解除
subscribsion();

console.log('8.js')