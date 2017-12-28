import { createStore, compose, applyMiddleware } from 'redux';
import reducer from '../reducers/reducer';

const store = createStore(reducer, compose(
	// applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : noop => noop,
));




export default store;
