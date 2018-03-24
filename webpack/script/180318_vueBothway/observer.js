import Dep from './dep';

function defineReactive(obj, key, val) {
    let dep = new Dep();

    // 给当前属性的值添加监听
    let childOb = observer(val);

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {
            console.log('get value: ', val)
            if (Dep.target) {
                dep.addSub(Dep.target)
            }

            return val;
        },

        set: (newVal) => {
            if (val === newVal) {
                console.log('无需更新');
                return;
            }

            console.log('new value setted: ', newVal)
            val = newVal;
            dep.notify();
        }
    })
}

export function observer(value) {
    if (!value || typeof value !== 'object') {
        return
    }

    Object.keys(value).forEach(key => defineReactive(value, key, value[key]));
}
