import { connect } from 'react-redux';
import SearchAndCategory from '../components/SearchAndCategory';

import { changeCategory, changeDate } from '../actions/categoryAndDate';
import { search } from '../actions/search';

const mapStateToProps = state => {
    return { dialog: state.dialog };
};

// Добавляем в компонент экшн
const mapDispatchToProps = dispatch => {
    return {
        changeCategory: (phone, category) => {
            dispatch(changeCategory(phone, category));
        },
        changeDate: (phone, time, date) => {
            dispatch(changeDate(phone, time, date));
        },
        search: text => {
            dispatch(search(text));
        }
    };
};

const SearchAndCategoryContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchAndCategory);

export default SearchAndCategoryContainer;
