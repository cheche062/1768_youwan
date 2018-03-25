import {BehaviorSubject} from 'rxjs/Rx';


let subject = new BehaviorSubject(0)

subject.subscribe({
    next: val => console.log('A ', val)
})

subject.next(1)
subject.next(2)

subject.subscribe({
    next: val => console.log('B ', val)
})

subject.next(3)
