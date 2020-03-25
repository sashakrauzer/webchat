import {
    REQUEST_ERROR,
    ASYNC_ACTION,
    SEARCH_DIALOGS_REQUEST,
    SEARCH_DIALOGS_FAIL,
    CHANGE_DATE_FAIL,
    CHANGE_DATE_REQUEST,
    CHANGE_CATEGORY_FAIL,
    CHANGE_CATEGORY_REQUEST,
    CLOSE_DIALOG_FAIL,
    CLOSE_DIALOG_REQUEST,
    OPEN_DIALOG_FAIL,
    OPEN_DIALOG_REQUEST
} from '../constants';

const errors = (state = [], action) => {
    switch (action.type) {
        case REQUEST_ERROR:
            return [action.error];
        case SEARCH_DIALOGS_FAIL:
            console.log('SEARCH_DIALOGS_FAIL', action.error);
            return state;
        case CHANGE_DATE_FAIL:
            console.log('Ошибка при измении даты решения');
            return state;
        case CHANGE_CATEGORY_FAIL:
            console.log('change category fail');
            return state;
        case CLOSE_DIALOG_FAIL:
            console.log('ошибка закрытия диалога', action.error);
            return state;
        case OPEN_DIALOG_FAIL:
            console.log('ошибка открытия диалога', action.error);
            state[0] = action.error;
            return state.slice(0);
        default:
            return state;
    }
};

const loading = (
    state = {
        count: 0
    },
    action
) => {
    switch (action.type) {
        case ASYNC_ACTION:
            return {
                count: ++state.count
            };
        case REQUEST_ERROR:
            return {
                count: state.count > 0 ? --state.count : 0
            };
        case SEARCH_DIALOGS_REQUEST:
            console.log('SEARCH_DIALOGS_REQUEST', action.text);
            return state;
        case CHANGE_DATE_REQUEST:
            console.log('Запрос на измение даты решения');
            return state;
        case CHANGE_CATEGORY_REQUEST:
            console.log('change category request');
            return state;
        case CLOSE_DIALOG_REQUEST:
            console.log('Запрос на закрытие диалога');
            return state;
        case OPEN_DIALOG_REQUEST:
            console.log('Запрос на открытие диалога');
            return state;
        default:
            return state;
    }
};

const rootReducer = {
    errors,
    loading
};

export default rootReducer;
