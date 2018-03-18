import Watcher from './watcher';
import { observer } from './observer';

export default class Vue {
    constructor(options = {}) {
        this.$options = options;
        this._data = this.$options.data;
        Object.keys(this._data).forEach(key => this._proxy(key));

        observer(this._data);
    }

    $watch(expOrFn, cb) {
        new Watcher(this, expOrFn, cb);
    }

    $recover(){

    }

    _proxy(key) {
        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get: () => this._data[key],
            set: (val) => {
                this._data[key] = val;
            }
        })
    }
}
