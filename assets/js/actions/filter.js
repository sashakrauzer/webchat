import { FILTER_DIALOGS } from '../constants';

// Вместо объекта возвращается функция, redux-thunk выполняет её
export const filter = (category, solve_time, strategy) => {
    return dispatch => {
        dispatch({
            type: FILTER_DIALOGS,
            category,
            solve_time,
            strategy
        });
    };
};
