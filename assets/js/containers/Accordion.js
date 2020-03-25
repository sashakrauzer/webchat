import { connect } from 'react-redux';
import Accordion from '../components/Accordion';
import { bindActionCreators } from 'redux';

export const selectCity = (cityID, variant) => {
    return { type: 'SELECT_CITY', cityID, variant };
};

export const setType = variant => {
    return { type: 'SET_TYPE', variant };
};

export const saveComment = text => {
    return { type: 'SAVE_COMMENT', text };
};

export const selectedOffices = data => {
    return { type: 'SELECTED_OFFICES', data };
};

const mapStateToProps = state => {
    return {
        store: {
            dialog: state.dialog,
            auth: state.auth,
            contactResult: state.contactResult,
            messages: state.messages,
            userInfo: state.userInfo,
            selectedOffices: state.selectedOffices,
            oldContactsResults: state.oldContactsResults
        }
    };
};

// Добавляем в компонент экшн
const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({ selectCity, setType, saveComment, selectedOffices }, dispatch)
    };
};

const AccordionContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Accordion);

export default AccordionContainer;
