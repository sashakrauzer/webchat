const sortAndSearch = (state = {sort: {type: null, params: null}}, action) => {
    let newState;
    switch (action.type) {
        case 'FIRST_NEW':
            newState = Object.assign({}, state, {sort: {type: action.type, params: action.data}});
            console.log('NEWSTATE', newState);
            return newState;
        case 'FIRST_OLD':
            newState = Object.assign({}, state, {sort: {type: action.type, params: action.data}});
            console.log('NEWSTATE', newState);
            return newState;
        default:
            return state;
    }
};

export default sortAndSearch;
