import { TELEGRAPHER_LOGIN } from '../constants';

// Вместо объекта возвращается функция, redux-thunk выполняет её
export const logIn = telegrapher => {
    return dispatch => {
        dispatch({ type: TELEGRAPHER_LOGIN, telegrapher });
    };
};
