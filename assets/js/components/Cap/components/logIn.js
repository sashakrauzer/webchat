import React from 'react';
import ReactModal from 'react-modal';

export default class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            loginValid: false,
            passwordValid: false,
            fieldsValid: false
        };
    }

    validateFields(e) {
        const name = e.target.name;
        const value = e.target.value;
        if (value.length > 0) {
            this.setState({ [name]: value, [name + 'Valid']: true }, () => {
                if (this.state.loginValid && this.state.passwordValid) {
                    this.setState({ fieldsValid: true });
                } else {
                    this.setState({ fieldsValid: false });
                }
            });
        } else {
            this.setState({ [name]: value, [name + 'Valid']: false }, () => {
                this.setState({ fieldsValid: false });
            });
        }
    }

    toLogIn() {
        if (this.state.loginValid && this.state.passwordValid) {
            this.props.logIn({
                username: this.state.login,
                password: this.state.password
            });
        }
    }

    render() {
        return (
            <ReactModal
                isOpen={!this.props.auth.status}
                contentLabel="Minimal Modal Example"
                className="modal"
                overlayClassName="overlay"
            >
                <label>
                    {' '}
                    Логин
                    <br />
                    <input
                        type="text"
                        name="login"
                        value={this.state.login}
                        onChange={this.validateFields.bind(this)}
                    />
                </label>
                <br />
                <label>
                    {' '}
                    Пароль
                    <br />
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.validateFields.bind(this)}
                    />
                </label>
                <br />
                <button
                    onClick={this.toLogIn.bind(this)}
                    disabled={!this.state.fieldsValid}
                >
                    Войти
                </button>
            </ReactModal>
        );
    }
}
