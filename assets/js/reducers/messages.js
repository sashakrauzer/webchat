import {
    SHOW_MESSAGES,
    SEND_MESSAGE,
    CLOSE_DIALOG_SUCCESS,
    RECEIVED_NEW_MESSAGE,
    SEND_MESSAGE_SUCCESS,
    GET_OLD_MESSAGES,
    EDIT_MESSAGE,
    DELETE_MESSAGE
} from '../constants';

// 1. Выводим сообщения выбранного пользователя в чат
// 2. Отправляем сообщение на сервер
// 3. Закрываем диалог, очищаем чат
const messages = (state = [], action) => {
    let newState;
    switch (action.type) {
        case SHOW_MESSAGES:
            // Все сообщения текущего диалога
            return action.messages;
        /**
         *
         * Входящее сообщение
         *
         */
        case EDIT_MESSAGE: 
            newState = [...state]
            const editedMessage = newState.find(message => message.uuid === action.id)
            editedMessage.text = action.text
            return newState
        case DELETE_MESSAGE: 
            newState = [...state]
            const deletedMessage = newState.find(message => message.uuid === action.id)
            return newState.filter(obj => obj !== deletedMessage)
        case RECEIVED_NEW_MESSAGE:
            console.log(
                'RECEIVED_NEW_MESSAGE messages',
                state,
                action,
                'dialog',
                action.dialog
            );
            /*
            Получив дополнительно state.dialog, сравниваем, номера телефонов
            */
            if (action.messages.from === action.dialog.user_phone) {
                /*
                Если номера одинаковые, то кидаем сообщение в текущий чат
                */
                state.push(action.messages);
                return state.slice(0);
            }
            if (action.messages.to === action.dialog.user_phone) {
                state.push(action.messages);
                return state.slice(0);
            }
            return state;
        case SEND_MESSAGE:
            // Отправляем сообщение
            newState = [...state];
            newState.push({
                from: 'staff',
                to: action.message.dialog.user_phone,
                date: Math.floor(Date.now() / 1000),
                text: action.message.value,
                uuid: action.myUUID,
                sended: 'in-process',
                chanel: action.message.chanel === 'wa' ? 'wa' : 'chat'
            });
            return newState;
        /* 
            Вставляем сообщение в текущее окно 
            */
        case GET_OLD_MESSAGES:
            return [...action.messages, ...state];
        case SEND_MESSAGE_SUCCESS:
            if (state.length) {
                state.map(elem => {
                    if (elem.uuid === action.uuid) {
                        elem.sended = 'success';
                    }
                    return elem;
                });
                return state.slice(0);
            }
            return state;
        case CLOSE_DIALOG_SUCCESS:
            return [];
        default:
            return state;
    }
};

export default messages;
