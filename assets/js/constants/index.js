export const BASE_URL = '/';

let path = '';
/* global process */
switch (process.env.NODE_ENV) {
    case 'production':
        path = 'https://crcal.sovcombank.ru/chat/';
        break;
    case 'testing':
        path = 'https://crcal-test.sovcombank.ru/chat/';
        break;
    default:
        path = 'https://crcal-dev.sovcombank.ru/chat/';
        break;
}

export const API_URL = path;
export const LOG_URL = 'https://api-app.sovcombank.ru/log/graphql';

export const ASYNC_ACTION = 'ASYNC_ACTION';

export const REQUEST_ERROR = 'REQUEST_ERROR';

export const SEARCH = 'SEARCH';
export const CONNECTED = 'CONNECTED';

export const READ_MESSAGE = 'READ_MESSAGE';
export const NEW_MESSAGE_FROM_CLOSE_DIALOG = 'NEW_MESSAGE_FROM_CLOSE_DIALOG';

export const EDIT_MESSAGE = 'EDIT_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';

export const SHOW_MESSAGES = 'SHOW_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAIL = 'SEND_MESSAGE_FAIL';
export const RECEIVED_NEW_MESSAGE = 'RECEIVED_NEW_MESSAGE';
export const GET_OLD_MESSAGES = 'GET_OLD_MESSAGES';

export const CHANGE_CATEGORY_REQUEST = 'CHANGE_CATEGORY_REQUEST';
export const CHANGE_CATEGORY_SUCCESS = 'CHANGE_CATEGORY_SUCCESS';
export const CHANGE_CATEGORY_FAIL = 'CHANGE_CATEGORY_FAIL';

export const CHANGE_DATE_REQUEST = 'CHANGE_DATE_REQUEST';
export const CHANGE_DATE_SUCCESS = 'CHANGE_DATE_SUCCESS';
export const CHANGE_DATE_FAIL = 'CHANGE_DATE_FAIL';

export const CHANGE_SOLVE_TIME = 'CHANGE_SOLVE_TIME';

export const GET_OLD_DIALOGS = 'GET_OLD_DIALOGS';
/**
 * Открытый диалог
 */

export const CLOSE_DIALOG_REQUEST = 'CLOSE_DIALOG_REQUEST';
export const CLOSE_DIALOG_SUCCESS = 'CLOSE_DIALOG_SUCCESS';
export const CLOSE_DIALOG_FAIL = 'CLOSE_DIALOG_FAIL';

export const OPEN_DIALOG_REQUEST = 'OPEN_DIALOG_REQUEST';
export const OPEN_DIALOG_SUCCESS = 'OPEN_DIALOG_SUCCESS';
export const OPEN_DIALOG_FAIL = 'OPEN_DIALOG_FAIL';

export const LEAVE_DIALOG = 'LEAVE_DIALOG';

/**
 * Колонка с диалогами
 */

export const SEARCH_DIALOGS_REQUEST = 'SEARCH_DIALOGS_REQUEST';
export const SEARCH_DIALOGS_SUCCESS = 'SEARCH_DIALOGS_SUCCESS';
export const SEARCH_DIALOGS_FAIL = 'SEARCH_DIALOGS_FAIL';

export const SEARCH_DIALOGS = 'SEARCH_DIALOGS';
export const FILTER_DIALOGS = 'FILTER_DIALOGS';

export const LOCK_DIALOG = 'LOCK_DIALOG';
export const UNLOCK_DIALOG = 'UNLOCK_DIALOG';
export const DIALOG_USED_ANOTHER_OPERATOR = 'DIALOG_USED_ANOTHER_OPERATOR';

/**
 * Авторизация
 */

export const TELEGRAPHER_LOGIN = 'TELEGRAPHER_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
