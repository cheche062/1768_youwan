import Immutable from 'immutable';
import {combineReducers} from 'redux';


// 代办事项
var todoListInitState = Immutable.List([]);


function todoListReducer(state = todoListInitState, action) {
    switch (action.type) {
        case "ADD_TODO":
            let { title, index, isDone } = action;

            // 纯
            return state.push({ title, index, isDone });
            break;

        case "TOGGLE_TODO":
            return state.map((item, index) => {
                if(item.index === action.index){
                    return {
                        title: item.title,
                        index: item.index,
                        isDone: !item.isDone
                    }
                }else{
                    return item;
                }
            })
            break;

        default:
            return state;
    }
}


var personInfo = Immutable.Map({
    name: 'cheche',
    age: 20
})

// 个人信息
function infoReducer(state = personInfo, action) {
    switch (action.type) {
        case "SET_NAME":
            return state.set('name', action.val);
            break;

        case "SET_AGE":
            return state.set('age', action.val);
            break;

        default:
            return state;
    }
}

export default combineReducers({
    todoListReducer,
    infoReducer
});
