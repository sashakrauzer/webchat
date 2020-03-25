import React from 'react';
import ReactModal from 'react-modal';

export default class ResultModal extends React.Component {
    constructor() {
        super();
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

    handleCloseModalAndOpenDialog() {
        this.setState({ showModal: false, value: '' });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    render() {
        let type = this.props.state.type;
        if (type === 'meeting') {
            return (
                <ReactModal
                    isOpen={this.props.state.submitStatus === 'sended'}
                    contentLabel="Result submit success"
                    className="modal resultModal"
                    overlayClassName="overlay"
                >
                    <h2>Результат контактности записан!</h2>
                    <ul>
                        <li className="fio">{this.props.fio}</li>
                        <li className="phone">{this.props.phone}</li>
                        <li className="date">{`${this.props.date}   ${this.props.interval}`}</li>
                        <li className="address">{this.props.officeName}<br /><span>{this.props.address}</span></li>
                    </ul>
                    <div className="footer">
                        <button onClick={this.props.closeModal}>Закрыть</button>
                    </div>
                </ReactModal>
            );
        } else if (type === 'clientRefusal' || type === 'bankRefusal') {
            return (
                <ReactModal
                    isOpen={this.props.state.submitStatus === 'sended'}
                    contentLabel="Result submit success"
                    className="modal resultModal"
                    overlayClassName="overlay"
                >
                    <h2>Результат контактности записан!</h2>
                    <ul>
                        <li className="fio">{this.props.fio}</li>
                        <li className="phone">{this.props.phone}</li>
                        <li className="comment">{this.props.comment}</li>
                    </ul>
                    <div className="footer">
                        <button onClick={this.props.closeModal}>Закрыть</button>
                    </div>
                </ReactModal>
            );
        } else if (type === 'contactLater') {
            console.log('DATE', this.props.dateWithTime);
            return (
                <ReactModal
                    isOpen={this.props.state.submitStatus === 'sended'}
                    contentLabel="Result submit success"
                    className="modal resultModal"
                    overlayClassName="overlay"
                >
                    <h2>Результат контактности записан!</h2>
                    <ul>
                        <li className="fio">{this.props.fio}</li>
                        <li className="phone">{this.props.phone}</li>
                        <li className="dateWithTime">{this.props.dateWithTime}</li>
                        <li className="comment">{this.props.comment}</li>
                    </ul>
                    <div className="footer">
                        <button onClick={this.props.closeModal}>Закрыть</button>
                    </div>
                </ReactModal>
            );
        } else {
            return null;
        }
    }
}
