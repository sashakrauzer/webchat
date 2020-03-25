export const firstNew = data => {
    return {
        type: 'FIRST_NEW',
        data
    };
};

export const firstOld = data => {
    return {
        type: 'FIRST_OLD',
        data
    };
};

export const hour = () => {
    return {
        type: 'HOUR'
    };
};

export const today = () => {
    return {
        type: 'TODAY'
    };
};

export const interval = (from, to) => {
    return {
        type: 'INTERVAL',
        from,
        to
    };
};
