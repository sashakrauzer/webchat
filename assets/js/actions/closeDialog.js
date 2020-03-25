import {
    CLOSE_DIALOG_REQUEST,
    CLOSE_DIALOG_SUCCESS,
    CLOSE_DIALOG_FAIL,
    API_URL
} from '../constants';

// Вместо объекта возвращается функция, redux-thunk выполняет её
export const closeDialog = (phone, reason) => {
    return dispatch => {
        dispatch({ type: CLOSE_DIALOG_REQUEST });

        let obj = {
            phone: phone,
            reason: reason,
            username: 'sovkombank',
            password: '123456'
        };

        fetch(API_URL + 'dialogClose', {
            method: 'post',
            body: JSON.stringify(obj),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(response => {
                console.log('ошибка в then', response);
                if (response.ok) {
                    dispatch({ type: CLOSE_DIALOG_SUCCESS, phone });
                } else {
                    dispatch({
                        type: CLOSE_DIALOG_FAIL,
                        error: response.json()
                    });
                }
            })
            .catch(error => {
                console.log('Ошибка в catch', error);
                dispatch({ type: CLOSE_DIALOG_FAIL, error });
            });
    };
};
