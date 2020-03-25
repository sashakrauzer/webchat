import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cap from '../components/Cap';

import { filter } from '../actions/filter';
import { logIn } from '../actions/auth';
import { changeCategory, changeDate } from '../actions/categoryAndDate';
import * as sortAndSearch from '../actions/sortAndSearch';

const mapStateToProps = state => {
    return {
        dialog: state.dialog,
        auth: state.auth
    };
};

// Добавляем в компонент экшн
const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(sortAndSearch, dispatch),
        filter: (category, solve_time, strategy) => {
            dispatch(filter(category, solve_time, strategy));
        },
        logIn: telegrapher => {
            dispatch(logIn(telegrapher));
        },
        changeCategory: (phone, category) => {
            dispatch(changeCategory(phone, category));
        },
        changeDate: (phone, time, date) => {
            dispatch(changeDate(phone, time, date));
        }
    };
};

const CapContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Cap);

export default CapContainer;
