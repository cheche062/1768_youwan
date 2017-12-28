import posts from "./postsReducer";
import comments from "./commentsReducer";
import dotProp from "dot-prop-immutable";
import { combineReducers } from "redux";
import reduceReducers from "reduce-reducers";

const combinedReducer = combineReducers({
    posts,
    comments
});


function addComment(state, action) {
    const { payload } = action;
    const { postId, commentId, commentText } = payload;

    // State here is the entire combined state
    const updatedWithPostState = dotProp.set(
        state,
        `posts.byId.${postId}.comments`,
        comments => comments.concat(commentId)
    );

    const updatedWithCommentsTable = dotProp.set(
        updatedWithPostState,
        `comments.byId.${commentId}`, { id: commentId, text: commentText }
    );

    const updatedWithCommentsList = dotProp.set(
        updatedWithCommentsTable,
        `comments.allIds`,
        allIds => allIds.concat(commentId);
    );

    return updatedWithCommentsList;
}

const featureReducers = createReducer({}, {
    ADD_COMMENT: addComment,
});

const rootReducer = reduceReducers(combinedReducer, featureReducers);





// --------------------------------------------------------------------------------------------------
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

function createNamedWrapperReducer(reducerFunction, reducerName) {
    return (state, action) => {
        const { name } = action;
        const isInitializationCall = state === undefined;
        if (name !== reducerName && !isInitializationCall) return state;

        return reducerFunction(state, action);
    }
}

(state, action) => {
    const { name } = action;
    const isInitializationCall = state !== undefined;
    if (name !== reducerName && isInitializationCall) return state;

    let reducer = (state = 0, action) => {
        switch (action.type) {
            case 'INCREMENT':
                return state + 1;
            case 'DECREMENT':
                return state - 1;
            default:
                return state;
        }
    }

    return reducer(state, action);
}

const rootReducer = combineReducers({
    counterA: createNamedWrapperReducer(counter, 'A'),
    counterB: createNamedWrapperReducer(counter, 'B'),
    counterC: createNamedWrapperReducer(counter, 'C'),
});


// --------------------------------------------------------------------------------------------------
function createFilteredReducer(reducerFunction, reducerPredicate) {
    return (state, action) => {
        const isInitializationCall = state === undefined;
        const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall;
        return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
    }
}

const rootReducer = combineReducers({
            // 检查后缀
            counterA: createFilteredReducer(counter, action => action.type.endsWith('_A')),
            // 检查 action 中的额外数据
            counterB: createFilteredReducer(counter, action => action.name === 'B'),
            // 响应所有的 'INCREMENT' action，但不响应 'DECREMENT'
            counterC: createFilteredReducer(counter, action => action.type === 'INCREMENT')
        };



import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addTodo } from './TodoActions'

class AddTodo extends Component {
  handleClick() {
    // 生效！
    this.props.dispatch(addTodo('Fix the issue'))
  }

  render() {
    return (
      <button onClick={() => this.handleClick()}>
        Add
      </button>
    )
  }
}

// 除了 state，`connect` 还把 `dispatch` 放到 props 里。
export default connect()(AddTodo)
