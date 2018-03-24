/**
 * 对订阅者进行收集、存储和通知
 *
 * @class      Dep (name)
 */
export default class Dep {
    constructor() {
        this.subs = [];
    }

    //添加订阅者
    addSub(sub) {
        if (!this.subs.includes(sub)) {
            this.subs.push(sub);
        }
    }

    notify() {
        // 通知所有的订阅者（Watcher），触发订阅者的相应逻辑处理
        this.subs.forEach(sub => sub.update());
    }
}

Dep.target = null;