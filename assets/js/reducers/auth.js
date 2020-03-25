import { TELEGRAPHER_LOGIN, LOGIN_SUCCESS, LOGIN_ERROR } from '../constants';

import socket from '../websocket';

const auth = (
    state = {
        status: false,
        token: '',
        agent: ''
    },
    action
) => {
    switch (action.type) {
        case TELEGRAPHER_LOGIN:
            socket.send(JSON.stringify(action.telegrapher));
            window.sessionStorage.setItem(
                'username',
                action.telegrapher.username
            );
            return {
                ...state,
                agent: action.telegrapher.username
            };
        case LOGIN_SUCCESS:
            window.sessionStorage.setItem('token', action.data.token);
            return {
                ...state,
                status: true,
                token: action.data.token
            };
        case LOGIN_ERROR:
            window.sessionStorage.setItem('token', '');
            return {
                token: '',
                status: false,
                agent: ''
            };
        default:
            return state;
    }
};

export default auth;
