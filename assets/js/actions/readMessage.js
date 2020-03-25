import { READ_MESSAGE } from '../constants';

export const readMessage = phone => {
    return dispatch => {
        dispatch({ type: READ_MESSAGE, phone });
    };
};
