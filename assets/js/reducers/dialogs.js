import {
    CLOSE_DIALOG_SUCCESS,
    OPEN_DIALOG_SUCCESS,
    CHANGE_CATEGORY_SUCCESS,
    CHANGE_DATE_SUCCESS,
    RECEIVED_NEW_MESSAGE,
    READ_MESSAGE,
    SEARCH_DIALOGS,
    FILTER_DIALOGS,
    NEW_MESSAGE_FROM_CLOSE_DIALOG,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE,
    CONNECTED,
    LOCK_DIALOG,
    UNLOCK_DIALOG,
    GET_OLD_DIALOGS
} from '../constants';

import moment from 'moment';

function parseSolveTime(solve_time) {
    let from_date;
    let till_date;

    switch (solve_time) {
        case 'просроченные':
            till_date = moment()
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .unix();
            break;
        case 'сегодня':
            from_date = moment()
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .unix();
            till_date = moment()
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .add(1, 'days')
                .unix();
            break;
        case 'завтра':
            from_date = moment()
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .add(1, 'days')
                .unix();
            till_date = moment()
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .add(2, 'days')
                .unix();
            break;
        case 'послезавтра':
            from_date = moment()
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .add(2, 'days')
                .unix();
            till_date = moment()
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .add(3, 'days')
                .unix();
            break;
        case 'позднее':
            from_date = moment()
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .add(3, 'days')
                .unix();
            break;
    }

    return { from_date, till_date };
}

const dialogs = (state = [], action) => {
    let newState;
    switch (action.type) {
        case CONNECTED:
            return action.data;
        case GET_OLD_DIALOGS:
            return [...state, ...action.data];
        case NEW_MESSAGE_FROM_CLOSE_DIALOG:
            /*
            Кидаем профиль к другим, помечаем его как с Новым сообщением
            */
            action.data.newMessage = true;
            state.unshift(action.data);
            return state.slice(0);
        /**
         *
         * Входящее сообщение
         *
         */
        case RECEIVED_NEW_MESSAGE:
            console.log('RECEIVED_NEW_MESSAGE dialogs', action);
            if (action.data.from.toLowerCase() === 'staff') {
                for (let i = 0; i < state.length; i++) {
                    /*
                Находим владельца входящего сообщения
                 */
                    if (state[i].user_phone === action.data.to) {
                        /*
                     Кидаем ему это сообщение
                     */
                        state[i].messages.push(action.data);
                        /*
                     Если диалог с этим пользователем не открыт и не от staff, помечаем его как С новым сообщением,
                     И переносим вверх
                     */
                        if (
                            action.dialog.user_phone !== action.data.to &&
                            action.data.from != 'staff'
                        ) {
                            state[i].newMessage = true;
                            let dialog = state.splice(i, 1);
                            state.unshift(dialog[0]);
                        }
                        // Переносим диалог вверх
                    }
                }
            } else {
                for (let i = 0; i < state.length; i++) {
                    /*
                Находим владельца входящего сообщения
                 */
                    if (state[i].user_phone === action.data.from) {
                        /*
                     Кидаем ему это сообщение
                     */
                        state[i].messages.push(action.data);
                        /*
                     Если диалог с этим пользователем не открыт, помечаем его как С новым сообщением,
                     И переносим вверх
                     */
                        if (action.dialog.user_phone !== action.data.from) {
                            state[i].newMessage = true;
                            let dialog = state.splice(i, 1);
                            state.unshift(dialog[0]);
                        }
                        // Переносим диалог вверх
                    }
                }
            }
            return state.slice(0);
        // Диалог закрыт успешно
        case SEND_MESSAGE:
            // Клонируем состояние
            newState = state.slice(0);
            // Перебираем массив, находим нужный диалог
            for (let i = 0; i < newState.length; i++) {
                if (
                    newState[i].user_phone === action.message.dialog.user_phone
                ) {
                    // Найдя диалог, клонируем его. В исходном массиве удаляем старый и заменяем новым. Чтобы не мутировать состояние
                    let newDialog = Object.assign({}, newState[i]);
                    newState.splice(i, 1, newDialog);
                    newDialog.messages.push({
                        from: 'staff',
                        to: action.message.dialog.user_phone,
                        date: Math.floor(Date.now() / 1000),
                        text: action.message.value,
                        uuid: action.myUUID,
                        sended: 'in-process'
                    });
                }
            }
            return newState;
        case SEND_MESSAGE_SUCCESS:
            // Клонируем состояние
            newState = state.slice(0);
            for (let i = 0; i < newState.length; i++) {
                // Клонируем диалог, ищем у него подходящее сообщение
                let newDialog = Object.assign({}, newState[i]);
                if (Array.isArray(newDialog.messages)) {
                    let messages = newDialog.messages;
                    for (let j = 0; j < messages.length; j++) {
                        if (messages[j].uuid === action.uuid) {
                            console.log('newDialog', newDialog);
                            messages[j].sended = 'success';
                            newState.splice(i, 1, newDialog);
                        }
                    }
                }
            }
            return state;
        case READ_MESSAGE:
            for (let i = 0; i < state.length; i++) {
                /*
                Сбрасываем всем метку текущего диалога
                */
                if (state[i].currentDialog) {
                    state[i].currentDialog = false;
                }
            }
            for (let i = 0; i < state.length; i++) {
                /*
                Находим диалог пользователя с непрочитанными сообщениями
                */
                if (state[i].user_phone === action.phone) {
                    state[i].need_open = false;
                    state[i].newMessage = false;
                    state[i].currentDialog = true;
                    return state.slice(0);
                }
            }
            return state;
        case CLOSE_DIALOG_SUCCESS:
            console.log('Удаляем пользователя из списка слева', action.phone);
            for (let i = 0; i < state.length; i++) {
                if (state[i].user_phone === action.phone) {
                    state.splice(i, 1);
                }
            }
            return state.slice(0);
        case OPEN_DIALOG_SUCCESS:
            // Если диалог уже существует
            for (let i = 0; i < state.length; i++) {
                if (state[i].user_phone === action.data.user_phone) {
                    state[i].need_open = true;
                    state[i].newMessage = true;
                    state.unshift(state.splice(i, 1)[0]);
                    return state.slice(0);
                }
            }
            action.data.need_open = true;
            action.data.newMessage = true;
            // Отправляем диалог в самый верх
            state.unshift(action.data);
            return state.slice(0);
        case 'ADDED_DIALOG_SUCCESS':
            action.data.newMessage = true;
            // Отправляем диалог в самый верх
            state.unshift(action.data);
            return state.slice(0);
        case CHANGE_CATEGORY_SUCCESS:
            for (let i = 0; i < state.length; i++) {
                if (state[i].user_phone === action.phone) {
                    state[i].category = action.category;
                }
            }
            return state.slice(0);
        case CHANGE_DATE_SUCCESS:
            console.log('Успешное измение даты решения');
            for (let i = 0; i < state.length; i++) {
                if (state[i].user_phone === action.phone) {
                    console.log('dialogs date_success', action);
                    state[i].solve_time = action.date;
                }
            }
            return state.slice(0);
        case LOCK_DIALOG:
            newState = state.slice(0);
            for (let i = 0; i < newState.length; i++) {
                if (newState[i].user_phone === action.user_phone) {
                    newState[i].is_locked = true;
                    newState[i].last_agent = action.new_agent;
                }
            }
            return newState;
        case UNLOCK_DIALOG:
            newState = state.slice(0);
            for (let i = 0; i < newState.length; i++) {
                if (newState[i].user_phone === action.user_phone) {
                    newState[i].is_locked = false;
                    newState[i].last_agent = action.old_agent;
                }
            }
            return newState;
        default:
            return state;
    }
};

const searchDialog = (state = '', action) => {
    switch (action.type) {
        case SEARCH_DIALOGS:
            return Object.assign({}, state, { searchText: action.text });
        default:
            return state;
    }
};

const userInfo = (state = {}, action) => {
    switch (action.type) {
        case 'USER_INFO':
            return Object.assign({}, action.data);
        default:
            return state;
    }
};

const oldContactsResults = (state = [], action) => {
    switch (action.type) {
        case 'OLD_CONTACTS_RESULTS':
            return [...action.data]
        default:
            return state
    }
}

const filterDialog = (state = {}, action) => {
    const { from_date, till_date } =
        action.type == FILTER_DIALOGS ? parseSolveTime(action.solve_time) : {};

    switch (action.type) {
        case FILTER_DIALOGS:
            // Добавляем данные в фильтр
            return {
                ...state,
                from_date,
                till_date,
                category: action.category,
                solve_time: action.solve_time,
                strategy: action.strategy
            };
        default:
            return state;
    }
};

export default {
    dialogs,
    searchDialog,
    filterDialog,
    userInfo,
    oldContactsResults
};
