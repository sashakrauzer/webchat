import React from 'react';
import ReactModal from 'react-modal';

export default class Error extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //проходим по reducer messages и для каждого запускам компонент Message
        return <ModalError errors={this.props.errors} />;
    }
}

// Модальное окно
class ModalError extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            value: ''
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    onChange(e) {
        this.setState({ value: e.target.value });
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModalAndCloseDialog() {
        this.props.closeDialog(this.state.value);
        this.setState({ showModal: false, value: '' });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    componentWillUpdate() {
        if (this.props.errors[0]) {
            if (!this.state.showModal) {
                this.setState({ showModal: true });
            }
        }
    }

    render() {
        console.log(
            'error in error compoonent',
            this.props.errors[0] ? this.props.errors[0] : 'Ошибок нету'
        );
        return (
            <div>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                    className="modal"
                    overlayClassName="overlay"
                >
                    <button onClick={this.handleCloseModal.bind(this)}>
                        Ок
                    </button>
                    <p>{this.props.errors[0] ? this.props.errors[0] : ''}</p>
                </ReactModal>
            </div>
        );
    }
}
