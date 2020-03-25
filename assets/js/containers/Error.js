import { connect } from 'react-redux';
import Error from '../components/Error';

const mapStateToProps = state => {
    return {
        errors: state.errors
    };
};

const ErrorContainer = connect(mapStateToProps)(Error);

export default ErrorContainer;
