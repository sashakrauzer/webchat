let socket;

import { API_URL } from './constants';

if (window['WebSocket']) {
    socket = new WebSocket(API_URL.replace('https', 'wss') + 'staff');
    socket.onopen = function() {
        if (window.sessionStorage.getItem('token')) {
            socket.send(
                JSON.stringify({
                    token: window.sessionStorage.getItem('token')
                })
            );
        }
    };
    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log('Disconnected');
        } else {
            console.log('Обрыв соединения'); // например, 'убит' процесс сервера
        }
        console.log('Code: ' + event.code + ' причина: ' + event.reason);
    };
    socket.onerror = function(event) {
        console.log('error connect', event.data);
    };
    // Закрываем сокет перед перезагрузкой страницы
    window.onbeforeunload = function() {
        socket.close();
    };
}

export default socket;
