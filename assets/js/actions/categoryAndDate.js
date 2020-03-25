import {
    CHANGE_CATEGORY_REQUEST,
    CHANGE_CATEGORY_SUCCESS,
    CHANGE_CATEGORY_FAIL,
    CHANGE_DATE_REQUEST,
    CHANGE_DATE_SUCCESS,
    CHANGE_DATE_FAIL,
    API_URL
} from '../constants';

// Вместо объекта возвращается функция, redux-thunk выполняет её
export const changeCategory = (phone, category) => {
    return dispatch => {
        dispatch({ type: CHANGE_CATEGORY_REQUEST });

        let obj = {
            phone: phone,
            category: category,
            username: 'sovkombank',
            password: '123456'
        };

        fetch(API_URL + 'category', {
            method: 'post',
            body: JSON.stringify(obj),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(response => {
                if (response.ok) {
                    dispatch({
                        type: CHANGE_CATEGORY_SUCCESS,
                        phone,
                        category
                    });
                } else {
                    dispatch({
                        type: CHANGE_CATEGORY_FAIL,
                        error: response.json()
                    });
                }
            })
            .catch(error => {
                console.log('Ошибка в catch', error);
                dispatch({ type: CHANGE_CATEGORY_FAIL, error });
            });
    };
};

export const changeDate = (phone, time, date) => {
    return dispatch => {
        dispatch({ type: CHANGE_DATE_REQUEST });

        let obj = {
            phone: phone,
            time: time,
            username: 'sovkombank',
            password: '123456'
        };

        fetch(API_URL + 'setTimeToSolve', {
            method: 'post',
            body: JSON.stringify(obj),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(response => {
                if (response.ok) {
                    dispatch({ type: CHANGE_DATE_SUCCESS, phone, time, date });
                } else {
                    dispatch({
                        type: CHANGE_DATE_FAIL,
                        error: response.json()
                    });
                }
            })
            .catch(error => {
                console.log('Ошибка в catch', error);
                dispatch({ type: CHANGE_DATE_FAIL, error });
            });
    };
};
