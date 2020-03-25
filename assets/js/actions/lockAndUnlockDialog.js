import { LOCK_DIALOG, UNLOCK_DIALOG } from '../constants';

// Вместо объекта возвращается функция, redux-thunk выполняет её
export const lock = (user_phone, new_agent) => {
    return dispatch => {
        dispatch({ type: LOCK_DIALOG, user_phone, new_agent });
    };
};

export const unlock = (user_phone, old_agent) => {
    return dispatch => {
        dispatch({ type: UNLOCK_DIALOG, user_phone, old_agent });
    };
};
