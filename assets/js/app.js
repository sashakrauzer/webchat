import React from 'react';
import ReactDOM from 'react-dom';
import reducers from './reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import socket from './websocket';
import {
    RECEIVED_NEW_MESSAGE,
    NEW_MESSAGE_FROM_CLOSE_DIALOG,
    // CONNECTED,
    SEND_MESSAGE_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_ERROR
    // LOGIN_SUCCESS
} from './constants';
import { addedDialog, editMessage, deleteMessage } from './actions/messages';
// import { createLogger } from 'redux-logger'; import {SEND_MESSAGE_SUCCESS,
// SEND_MESSAGE_FAIL} from './constants'; const logger = createLogger();
const store = createStore(
    reducers,
    compose(
        applyMiddleware(thunkMiddleware),
        window['devToolsExtension'] ? window['devToolsExtension']() : f => f
    )
);

/**
 *
 *  Слушаем сообщения из сокета
 *
 */
socket.addEventListener('message', function(event) {
    console.log('onmessage', event);

    let data;

    try {
        data = JSON.parse(event.data);
    } catch (e) {
        if (event.data == 'Token accepted') {
            store.dispatch({
                type: LOGIN_SUCCESS,
                data: { token: window.sessionStorage.getItem('token') }
            });
        } else {
            store.dispatch({ type: LOGIN_ERROR });
        }

        console.log(e);
        return;
    }

    if (data.type === 'message_edited') {
        const text = data.params.text
        const id = data.params.message_id
        store.dispatch(editMessage(id, text))
    }

    if (data.type === 'message_deleted') {
        const id = data.params.message_id
        store.dispatch(deleteMessage(id))
    }

    if (data.action) {
        switch (data.action) {
            case 'unlock':
                store.dispatch({
                    type: 'UNLOCK_DIALOG',
                    user_phone: data.target,
                    old_agent: data.agent
                });
                break;
            case 'lock':
                store.dispatch({
                    type: 'LOCK_DIALOG',
                    user_phone: data.target,
                    new_agent: data.agent
                });
                break;
            default:
                break;
        }
    } else if (data.token) {
        store.dispatch({ type: LOGIN_SUCCESS, data });
    } else if (Array.isArray(data)) {
        //
    } else if (data.user_phone) {
        store.dispatch({ type: NEW_MESSAGE_FROM_CLOSE_DIALOG, data });
    }

    // Статус по доставке
    if (data.status) {
        // TODO
        console.log('доставка сообщения', data.status, data.uuid);
        if (data.status == 'ok') {
            console.log('Сообщение отправлено');
            store.dispatch({ type: SEND_MESSAGE_SUCCESS, uuid: data.uuid });
        } else {
            console.log('Сообщение НЕ отправлено');
            // store.dispatch({type: SEND_MESSAGE_FAIL, data: data});
        }
    }

    // Новое сообщение
    if (data.from && data.from !== 'Technical Message') {
        if (data.from.toLowerCase() !== 'staff') {
            // Проверим, если диалог с таким пользователем в стейт
            let dialogs = store.getState().dialogs;
            for (let i = 0, check = false; i < dialogs.length; i++) {
                if (dialogs[i].user_phone === data.from) {
                    check = true;
                } else if (i + 1 === dialogs.length && !check) {
                    // добавим новый диалог в список
                    store.dispatch(addedDialog(data.from));
                }
            }
        }
        console.log('новое сообщение от ', data.from);
        let dialog = store.getState().dialog;
        store.dispatch({
            type: RECEIVED_NEW_MESSAGE,
            messages: data,
            data,
            dialog
        });
    }
});

import DialogsContainer from './containers/Dialogs';
import MessagesContainer from './containers/Messages';
import SendMessageContainer from './containers/SendMessage';
import CapContainer from './containers/Cap';
import AccordionContainer from './containers/Accordion';

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <div>
                    <CapContainer />
                    <div className="row dialog-and-chat">
                        <DialogsContainer />
                        <div className="chat1">
                            <MessagesContainer />
                            <SendMessageContainer />
                        </div>
                        <AccordionContainer />
                    </div>
                </div>
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

document.querySelector('.messages').scrollTop = 99999;
