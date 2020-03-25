import { connect } from 'react-redux';
import Messages from '../components/Messages';
import { GET_OLD_MESSAGES } from '../constants';

const mapStateToProps = state => {
    return {
        messages: state.messages,
        dialog: state.dialog
    };
};

const mapDispatchToProps = dispatch => {
    return {
        oldMessages: messages => dispatch({ type: GET_OLD_MESSAGES, messages })
    };
};

const MessagesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Messages);

export default MessagesContainer;
