import { SEARCH_DIALOGS } from '../constants';

export const search = text => {
    return dispatch => {
        dispatch({ type: SEARCH_DIALOGS, text });
    };
};
