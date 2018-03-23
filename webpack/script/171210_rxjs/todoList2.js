const Rx = require('rxjs/Rx');
const Observable = Rx.Observable;


export const mockHttpPost = (value) => {
    return Rx.Observable.create((observer) => {
        let status = 'pending'
        const timmer = setTimeout(() => {
            const result = {
                _id: ++dbIndex, value,
                isDone: false
            }
            searchStorage.set(result._id, result)
            status = 'done'
            observer.next(result)
            observer.complete()
        }, random(10, 1000))
        
        return () => {
            clearTimeout(timmer)
            if (status === 'pending') {
                console.warn('post canceled')
            }
        }
    })
}

Observable.create(observer => {
  request(xxxx, response => {
    // success callback
    observer.next(parse(response))
    observer.complete()
  }, err => {
    // error callback
    observer.error(err)
  })
  // teardown logic
  return () => request.abort()
})