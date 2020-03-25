import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialogs from '../components/Dialogs';

import * as messages from '../actions/messages';
import { openDialog } from '../actions/openDialog';
import * as lockAndUnlockDialog from '../actions/lockAndUnlockDialog';
import { search } from '../actions/search';
import { userInfo, oldContactsResults } from '../actions/';

import { CONNECTED, GET_OLD_DIALOGS } from '../constants';


const mapStateToProps = state => {
    return {
        searchDialog: state.searchDialog || {},
        dialog_id: state.dialog.id || null,
        filterDialog: state.filterDialog,
        dialogs: state.dialogs,
        auth: state.auth,
        sortAndSearch: state.sortAndSearch
    };
};

const mapDispatchToProps = dispatch => {
    return {
        init: data => dispatch({ type: CONNECTED, data }),
        getOldDialogs: data => dispatch({ type: GET_OLD_DIALOGS, data }),
        messages: bindActionCreators(messages, dispatch),
        lockAndUnlockDialog: bindActionCreators(lockAndUnlockDialog, dispatch),
        openDialog: bindActionCreators(openDialog, dispatch),
        search: text => dispatch(search(text)),
        userInfo: data => dispatch(userInfo(data)),
        oldContactsResults: data => dispatch(oldContactsResults(data))
    };
};

const DialogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Dialogs);

export default DialogContainer;
