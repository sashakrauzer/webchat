import {
    SHOW_MESSAGES,
    SEND_MESSAGE,
    READ_MESSAGE,
    API_URL,
    EDIT_MESSAGE,
    DELETE_MESSAGE 
} from '../constants';
import uuid from 'uuid-v4';
import socket from '../websocket';
let myUUID;

export const showMessages = (messages, dialog) => {
    return dispatch => {
        dispatch({
            type: SHOW_MESSAGES,
            messages,
            dialog
        });
    };
};

export const sendMessage = message => {
    return dispatch => {
        myUUID = uuid();

        // Отправляем сообщение по сокету
        socket.send(
            JSON.stringify({
                From: 'staff',
                To: message.dialog.user_phone,
                Date: Math.floor(Date.now() / 1000),
                Text: message.value.trim(),
                uuid: myUUID,
                token: message.auth.token,
                chanel: message.chanel === 'wa' ? 'wa' : 'chat'
            })
        );

        // Вызываем action
        dispatch({
            type: SEND_MESSAGE,
            message,
            myUUID
        });
    };
};

export const readMessage = phone => {
    return dispatch => {
        dispatch({ type: READ_MESSAGE, phone });
    };
};

export const editMessage = (id, text) => {
    return dispatch => {
        dispatch({type: EDIT_MESSAGE, id, text})
    }
}

export const deleteMessage = (id) => {
    return dispatch => {
        dispatch({type: DELETE_MESSAGE, id})
    }
}

// Добавляем новый диалог в общий список, помечаем его как с новым сообщением
export const addedDialog = phone => {
    return dispatch => {
        dispatch({ type: 'ADDED_DIALOG_REQUEST' });

        let obj = {
            phone: phone,
            username: 'sovkombank',
            password: '123456'
        };
        fetch(API_URL + 'createDialog', {
            method: 'post',
            body: JSON.stringify(obj),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(Promise.reject.bind(Promise));
                }
            })
            .then(data => {
                dispatch({ type: 'ADDED_DIALOG_SUCCESS', data });
            })
            .catch(error => {
                console.error('Ошибка', error);
                dispatch({ type: 'ADDED_DIALOG_FAIL', error: error.error });
            });
    };
};
