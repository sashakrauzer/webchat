import { ASYNC_ACTION } from '../constants';

export const asyncAction = () => {
    return { type: ASYNC_ACTION };
};

export const userInfo = data => {
    return { type: 'USER_INFO', data };
};

export const oldContactsResults = data => {
    return {type: 'OLD_CONTACTS_RESULTS', data}
}