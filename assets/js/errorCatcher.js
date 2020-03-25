import { LOG_URL } from './constants';

const gOldOnError = window.onerror;
// Переопределить прошлый обработчик события.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => {
    if (errorMsg.indexOf('Script error.') > -1) {
        return;
    }

    const text = `${errorMsg} Script: ${url} Line: ${lineNumber} Column: ${column} StackTrace: ${errorObj.toString()}`;

    const query = `
        mutation{
            error(url: $url, status: $status, text: $text){
                status
                errorCode
            }
        }
    `;

    const variables = {
        url: window.location.href,
        text
    };

    fetch(LOG_URL, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query,
            variables
        })
    });

    if (gOldOnError)
        // Вызвать прошлый обработчик события.
        return gOldOnError(errorMsg, url, lineNumber);

    // Просто запустить обработчик события по умолчанию.
    return false;
};
