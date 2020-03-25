import {
    SHOW_MESSAGES,
    CLOSE_DIALOG_SUCCESS,
    OPEN_DIALOG_SUCCESS,
    CHANGE_CATEGORY_SUCCESS,
    CHANGE_DATE_SUCCESS
} from '../constants';

const dialog = (state = {}, action) => {
    switch (action.type) {
        case SHOW_MESSAGES:
            return action.dialog;
        case CLOSE_DIALOG_SUCCESS:
            return {};
        case CHANGE_CATEGORY_SUCCESS:
            return {
                ...state,
                category: action.category
            };
        case CHANGE_DATE_SUCCESS:
            return {
                ...state,
                solve_time: action.date
            };
        case OPEN_DIALOG_SUCCESS:
            return state;
        default:
            return state;
    }
};

export default dialog;
