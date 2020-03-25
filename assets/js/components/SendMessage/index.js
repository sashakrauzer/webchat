import React from 'react';
import ReactModal from 'react-modal';
import InputMask from 'react-input-mask';

const emojiArr = '😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😗 😙 😚 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 😴 😌 😛 😜 😝 🤤 😒 😓 😔 😕 🙃 🤑 😲 ☹️ 🙁 😖 😞 😟 😤 😢 😭 😦 😧 😨 😩 🤯 😬 😰 😱 😳 🤪 😵 😡 😠 🤬 😷 🤒 🤕 🤢 🤮 🤧 😇 🤠 🤡 🤥 🤫 🤭 🧐 🤓 😈 👿 👹 👺 💀 👻 👽 🤖 💩 😺 😸 😹 😻 😼 😽 🙀 😿 😾'.split(' ');

export default class SendMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            openHamburger: false,
            openHamburgerEmoji: false,
            btn: 'main'
        };
    }

    sendMessage(e, type) {
        this.props.clearOffices();
        const { onClick, dialog, auth } = this.props;

        // Если введен текст и выбраны отделения
        if (this.state.value.length > 0 && this.props.selectedOffices.offices.length) {
            let addresses = '';
            for (let office of this.props.selectedOffices.offices) {
                if (addresses) {
                    addresses += ', ' + office.address;
                } else {
                    addresses += office.address;
                }
            }
            let result = this.state.value + '\n' + addresses;
            onClick({ value: result, dialog, auth, chanel: type });
            this.setState({ value: '' });
            
            // Иначе, если только текст
        } else if (this.state.value.length > 0) {
            onClick({ value: this.state.value, dialog, auth, chanel: type });
            this.setState({ value: '' });

            // Если только офисы
        } else if (this.props.selectedOffices.offices.length) {
            let addresses = '';
            for (let office of this.props.selectedOffices.offices) {
                if (addresses) {
                    addresses += ', ' + office.address;
                } else {
                    addresses += office.address;
                }
            }
            onClick({ value: addresses, dialog, auth, chanel: type });
            this.setState({ value: '' });
        }
    }

    closeDialog(reason) {
        const { closeDialog, dialog } = this.props;
        closeDialog(dialog.user_phone, reason);
        console.log(
            'диалог закрыт. тел: ',
            dialog.user_phone,
            'причина: ',
            reason
        );
    }

    openDialog(phone) {
        const { openDialog } = this.props;
        openDialog(phone);
    }

    // Раскрываем/скрываем меню с кнопками
    toggleMenu() {
        if (this.state.openHamburger) {
            this.setState({ openHamburger: false });
        } else {
            this.setState({ openHamburger: true });
        }
    }

    onHamburgerClick = () => {
        this.setState({
            openHamburgerEmoji: !this.state.openHamburgerEmoji
        });
    };

    onClickEmoji = event => {
        this.setState({
            value: this.state.value + event.target.textContent
        });
    };

    selectBtn(e, type) {
        this.setState({ btn: type, openHamburger: false });
    }

    onChange(e) {
        this.setState({ value: e.target.value });
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('keyPress e', this.state.btn);
            this.sendMessage(e, this.state.btn);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dialog.id != this.props.dialog.id) {
            try {
                let lastMessage =
                    nextProps.messages[nextProps.messages.length - 1];
                if (lastMessage.chanel) {
                    this.setState({ btn: lastMessage.chanel });
                }
            } catch (e) {
                console.log('Диалог пуст', e);
            }
        }
    }

    render() {
        const buttons = [
            {
                method: this.state.openHamburger
                    ? this.selectBtn.bind(this)
                    : this.sendMessage.bind(this),
                class: 'sendMessage-chat',
                type: 'chat',
                text: 'Отправить в КИ'
            },
            {
                method: this.state.openHamburger
                    ? this.selectBtn.bind(this)
                    : this.sendMessage.bind(this),
                class: 'sendMessage-wa',
                type: 'wa',
                text: 'Отправить в WA'
            }
        ];
        // Сортируем массив по state.btn
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].type === this.state.btn) {
                buttons.unshift(buttons.splice(i, 1)[0]);
            }
        }
        return (
            <div className="textarea">
                <div className="text-and-menu">
                    <p>Новое сообщение</p>
                    <div className="hamburger-emoji">
                        <p onClick={this.onHamburgerClick} className="toggle-menu">Emoji</p>
                        <div className={`emoji ${this.state.openHamburgerEmoji ? 'open' : ''}`}>
                            {emojiArr.map((elem, i) => {
                                return <span key={i} onClick={this.onClickEmoji}>{elem}</span>
                            })}
                        </div>
                    </div>
                </div>
                {this.props.selectedOffices.offices.length ? this.props.selectedOffices.offices.map((elem) => {
                    return <div key={elem.value} className="textarea-offices"><h4>{elem.label}</h4><span>{elem.address}</span></div>;
                }) : ''}
                <textarea
                    ref="textfield"
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                    onKeyPress={this._handleKeyPress.bind(this)}
                />
                <div className="row between-xs">
                    <div className="button">
                        <div className={`btn-hamburger ${this.state.openHamburger ? 'open' : ''}`}>
                            {buttons.map((item, i) => {
                                if (this.state.openHamburger) {
                                    return <button
                                            key={item.type}
                                            onClick={(e) => {item.method(e, item.type)}}
                                            className={item.class}>
                                            {item.text}
                                        </button>;
                                } else if (!this.state.openHamburger && i === 0) {
                                    return <button
                                            key={item.type}
                                            onClick={(e) => item.method(e, item.type)}
                                            className={item.class}>
                                            {item.text}
                                        </button>;
                                }
                                return;
                            })}
                        </div>
                        <div className="change-button" onClick={this.toggleMenu.bind(this)}/>
                    </div>
                    <ModalOpenDialog openDialog={this.openDialog.bind(this)} />
                    <ModalCloseDialog
                        closeDialog={this.closeDialog.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

class ModalCloseDialog extends React.Component {
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

    handleCloseModalAndCloseDialog() {
        this.props.closeDialog(this.state.value);
        this.setState({ showModal: false, value: '' });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleOpenModal}>Закрыть диалог</button>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                    className="modal modalCloseDialog"
                    overlayClassName="overlay"
                >
                    <h2>Укажите решение по вопросу</h2>
                    <textarea
                        value={this.state.value}
                        onChange={this.onChange.bind(this)}
                    />
                    <div className="row between-xs">
                        <button
                            onClick={this.handleCloseModalAndCloseDialog.bind(
                                this
                            )}
                        >
                            Закрыть диалог
                        </button>
                        <button onClick={this.handleCloseModal.bind(this)}>
                            Отменить
                        </button>
                    </div>
                </ReactModal>
            </div>
        );
    }
}

class ModalOpenDialog extends React.Component {
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
        this.props.openDialog(this.state.value.replace(/[\(\)\s\-]/g, ''));
        this.setState({ showModal: false, value: '' });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleOpenModal}>Открыть диалог</button>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                    className="modal modalOpenDialog"
                    overlayClassName="overlay"
                >
                    <h2>Введите номер телефона:</h2>
                    <InputMask
                        className="input"
                        mask="+7 (999) 999-99-99"
                        maskChar=" "
                        value={this.state.value}
                        onChange={this.onChange.bind(this)}
                    />
                    <div className="row between-xs">
                        <button
                            onClick={this.handleCloseModalAndOpenDialog.bind(
                                this
                            )}
                        >
                            Открыть диалог
                        </button>
                        <button onClick={this.handleCloseModal.bind(this)}>
                            Отменить
                        </button>
                    </div>
                </ReactModal>
            </div>
        );
    }
}
