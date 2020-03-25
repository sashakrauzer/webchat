import {
    OPEN_DIALOG_REQUEST,
    OPEN_DIALOG_SUCCESS,
    OPEN_DIALOG_FAIL,
    API_URL
} from '../constants';

// Получаем диалог с сервера и отдаем редюсерам.
// Он добавляется в общий список, и открывается.
export const openDialog = phone => {
    return dispatch => {
        dispatch({ type: OPEN_DIALOG_REQUEST });

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
                dispatch({ type: OPEN_DIALOG_SUCCESS, data });
            })
            .catch(error => {
                console.error('Ошибка', error);
                dispatch({ type: OPEN_DIALOG_FAIL, error: error.error });
            });
    };
};
