import Immutable from 'immutable';
import { addTodo, toggleTodo, setName, setAge } from './actions/action';
import store from './store/store';


let pre_todoList = store.getState().todoListReducer;
let pre_info = store.getState().infoReducer;

// 每次 state 更新时，打印日志
let unsubscribe1 = store.subscribe(() => {
    let info = store.getState().infoReducer;

    console.log('个人信息：')
    if (Immutable.is(pre_info, info)) {
        console.log('---未改变---')
        return;
    }

    pre_info = info;
    let currentInfo = info.toJS();
    console.log('改变---', currentInfo.name, currentInfo.age);

})

let unsubscribe2 = store.subscribe(() => {
    let todoList = store.getState().todoListReducer;

    console.log('代办列表：')
    if(Immutable.is(pre_todoList, todoList)){
    	console.log('---未改变---')
    	return;
    }

    pre_todoList = todoList;
    let currentTodoList = todoList.toJS();

    console.log('改变---', currentTodoList);
})


Object.assign(window, { store, addTodo, toggleTodo, setName, setAge });

// 停止监听 state 更新
// unsubscribe();
