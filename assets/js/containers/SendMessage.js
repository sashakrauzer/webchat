import { connect } from 'react-redux';
import SendMessage from '../components/SendMessage';
import { closeDialog } from '../actions/closeDialog';
import { sendMessage } from '../actions/messages';
import { openDialog } from '../actions/openDialog';

const mapStateToProps = state => {
    // Передаем объект dialog, с глобальным состоянием state.gialog
    return {
        messages: state.messages,
        dialog: state.dialog,
        auth: state.auth,
        selectedOffices: state.selectedOffices
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onClick: params => {
            //передаёт в компонент SendMessage props.onClick
            dispatch(sendMessage(params)); //это action для записи сообщения. Смотри в reducers/chat.js 14 строчку
        },
        closeDialog: (phone, reason) => {
            dispatch(closeDialog(phone, reason));
        },
        openDialog: phone => {
            dispatch(openDialog(phone));
        },
        clearOffices: () => {
            dispatch({
                type: 'CLEAR_OFFICES'
            });
        }
    };
};

const SendMessageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SendMessage);

export default SendMessageContainer;
