import { combineReducers } from 'redux';
import rootReducer from './root';
import messages from './messages';
import dialog from './dialog';
import dialogs from './dialogs';
import auth from './auth';
import sortAndSearch from './sortAndSearch';

const contactResult = (
    state = {
        cityID: '',
        stopsID: '',
        address: '',
        officeID: '',
        type: '',
        date: '',
        comment: ''
    },
    action
) => {
    switch (action.type) {
        case 'SELECT_CITY':
            return Object.assign({}, state, { [action.variant]: action.cityID });
        case 'SET_TYPE':
            return Object.assign({}, state, { type: action.variant });
        case 'SAVE_COMMENT':
            return Object.assign({}, state, { comment: action.text });
        default:
            return state;
    }
};

const selectedOffices = (state = {cleared: false, offices: []}, action) => {
    switch (action.type) {
        case 'SELECTED_OFFICES':
            return Object.assign({}, {cleared: false, offices: action.data.slice(0)});
        case 'CLEAR_OFFICES':
            return {cleared: true, offices: []};
        default:
            return state;
    }
};

const reducers = combineReducers({
    ...rootReducer,
    messages,
    dialog,
    ...dialogs,
    auth,
    contactResult,
    sortAndSearch,
    selectedOffices
});

export default reducers;
