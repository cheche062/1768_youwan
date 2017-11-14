const combinedReducer = combineReducers({
    a : sliceReducerA,
    b : sliceReducerB
});

function crossSliceReducer(state, action) {
    switch(action.type) {
        case "SOME_SPECIAL_ACTION" : {
            return {
                // 明确地把 state.b 作为额外参数进行传递
                a : handleSpecialCaseForA(state.a, action, state.b),
                b : sliceReducerB(state.b, action)
            }        
        }
        default : return state;
    }
}

function rootReducer(state, action) {
    const intermediateState = combinedReducer(state, action);
    const finalState = crossSliceReducer(intermediateState, action);
    return finalState;
}



const undoableFilteredSliceA = compose(undoReducer, filterReducer("ACTION_1", "ACTION_2"), sliceReducerA);
const rootReducer = combineReducers({
    a : undoableFilteredSliceA,
    b : normalSliceReducerB
});