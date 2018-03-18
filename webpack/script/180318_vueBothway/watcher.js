import Dep from './dep';


export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.cb = cb;
        this.val = this.get();
    }

    // 订阅数据更新时调用
    update() {
        let val = this.get();
        this.val = val;
        this.cb.call(this.vm, this.val);
    }

    get() {
        // 当前订阅者(Watcher)读取被订阅数据的最新更新后的值时，通知订阅者管理员收集当前订阅者
        Dep.target = this;
        let val = this.vm._data[this.expOrFn];

        Dep.target = null;
        return val;
    }
}
