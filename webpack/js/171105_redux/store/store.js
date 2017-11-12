import { createStore, compose, applyMiddleware } from 'redux';
import reducer from '../reducers/reducer';

const store = createStore(reducer, compose(
	// applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop,
));




export default store;
