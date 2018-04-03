import Rx, { Observable } from 'rxjs/Rx';

function checkValue(n) {
    if (n % 4 === 0) {
        throw new Error("Bad value");
    }

    return true;
}

const source = Rx.Observable.interval(100).take(10);

// 必须把每个流出的值分别的创建新的流且单独做处理。这样一个错误就不会影响接下来流出的值
source.switchMap(x => {
        return Observable
            .of(x)
            .filter(checkValue)
            .catch(err => {
                console.log(err)
                return Rx.Observable.empty()
            })
    })
    .subscribe((val) => console.log(val));