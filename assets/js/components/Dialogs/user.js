import React from 'react';
import moment from 'moment';
import 'moment/locale/ru.js';
import ReactTooltip from 'react-tooltip';
import { API_URL } from '../../constants';

moment.lang('ru');

export default class User extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tooltip: false,
            lock: props.is_locked,
            lockAnotherOperator:
                props.is_locked &&
                props.last_agent !== window.sessionStorage.getItem('username'),
            current: false
        };
    }

    onClick() {
        // Если диалог не в работе у другого оператора
        if (!this.state.lockAnotherOperator) {
            // И если диалог не заблокирован текущим оператором - блокируем
            if (!this.props.is_locked) {
                fetch(API_URL + 'lockDialog', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: this.props.user_phone,
                        username: 'sovkombank',
                        password: '123456',
                        newAgent: window.sessionStorage.getItem('username')
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            this.props.lock(
                                this.props.user_phone,
                                window.sessionStorage.getItem('username')
                            );
                            /**
                             *
                             *  Загрузка сообщений в диалог, и чтение новых сообщений
                             *
                             */
                            this.showAndReadMessages();
                        } else if (response.status === 500) {
                            this.props.lock(this.props.user_phone, 'unknown');
                        } else {
                            //
                        }
                    })
                    .catch(() => {
                        this.props.lock(this.props.user_phone, 'unknown');
                    });
            } else {
                // Очищаем таймер
                window.clearTimeout(
                    window.sessionStorage.getItem(this.props.user_phone)
                );
                window.sessionStorage.removeItem(this.props.user_phone);

                this.showAndReadMessages();
            }
        }
    }

    componentWillMount() {
        // При перезагрузке чата, анлочим все предыдущие диалоги
        if (this.state.lock && !this.state.lockAnotherOperator) {
            let timerId = setTimeout(() => {
                this.unlockDialog();
                window.sessionStorage.removeItem(this.props.user_phone);
            }, 5000);
            window.sessionStorage.setItem(this.props.user_phone, timerId);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.need_open) {
            this.onClick();
        }
        // Уход из диалога
        if (this.props.currentDialog && !nextProps.currentDialog) {
            console.log(`user ${this.props.user_phone} blur dialog`);
            if (this.state.lock) {
                let timerId = setTimeout(() => {
                    this.unlockDialog();
                    window.sessionStorage.removeItem(this.props.user_phone);
                }, 1000 * 100);
                window.sessionStorage.setItem(this.props.user_phone, timerId);
            }
        }

        // Обновляет состояние в ответ на lock/unlock
        this.setState({
            lock: nextProps.is_locked,
            lockAnotherOperator:
                nextProps.is_locked &&
                nextProps.last_agent !==
                    window.sessionStorage.getItem('username')
        });

        // Запрашиваем user info
        if (nextProps.currentDialog && !this.props.currentDialog) {
            console.log(this.props, 'and next ->', nextProps);
            fetch(API_URL + 'user-info/' + this.props.user_phone)
            .then(response => response.json())
            .then(result => this.props.userInfo(result))

            fetch(`${API_URL}/dialog/${this.props.user_phone}/contact-results`)
            .then(res => res.json())
                .then(result => result === null || undefined ? this.props.oldContactsResults([]) : this.props.oldContactsResults(result))
        }
    }

    showAndReadMessages() {
        const {
            id,
            readMessage,
            showMessages,
            messages,
            user_phone,
            fio,
            is_open,
            category,
            close_reason,
            solve_time
        } = this.props;

        // Выводим сообщения в чат и обновляет state.dialog
        showMessages(messages, {
            id,
            user_phone,
            fio,
            is_open,
            category,
            close_reason,
            solve_time
        });

        // Отмечаем сообщения прочитанными
        readMessage(user_phone);
    }

    // Блокировка диалога
    lockDialog() {
        fetch(API_URL + 'lockDialog', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: this.props.user_phone,
                username: 'sovkombank',
                password: '123456',
                newAgent: window.sessionStorage.getItem('username')
            })
        })
            .then(response => {
                if (response.ok) {
                    this.setState({
                        lock: true
                    });
                } else {
                    // 
                }
            })
            .catch(() => {
                this.setState({
                    lock: true,
                    lockAnotherOperator: true
                });
            });
    }

    unlockDialog() {
        fetch(API_URL + 'unlockDialog', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: this.props.user_phone,
                username: 'sovkombank',
                password: '123456',
                oldAgent: window.sessionStorage.getItem('username')
            })
        }).then(response => {
            if (response.ok) {
                this.props.unlock(
                    this.props.user_phone,
                    window.sessionStorage.getItem('username')
                );
            }
        });
    }

    render() {
        // Если диалог с новыми сообщениями, присваиваем класс
        let classText = this.props.newMessage ? 'newMessages' : '';

        // Также, если диалог открыт, назначаем класс
        classText += ' ' + (this.props.currentDialog ? 'currentDialog' : '');

        let classSearchMessage = this.props.searchMessage
            ? 'searchMessage'
            : '';
        let from, lastMessage, overdue, tooltip, li, lastMessageTime, strategy;

        // Если получили user info
        if (this.state.tooltip && this.props.currentDialog) {
            tooltip = (
                <div className="wrapTooltip">
                    <a
                        data-tip
                        data-for="global"
                        data-event="click focus"
                        ref="dataTip"
                    >
                        <i className="fa fa-info-circle" aria-hidden="true" />
                    </a>
                    <ReactTooltip
                        refs="reactTooltip"
                        globalEventOff="click"
                        class="extraClass"
                        id="global"
                        aria-haspopup="true">
                        <ul>
                            {
                                Object.keys(this.state.tooltip).map((item, i) => { 
                                    try { 
                                        if (item.toLowerCase().indexOf('url') != -1) { 
                                            return (
                                                <li key={i}>
                                                    {item}:{' '}
                                                    <a
                                                        href={this.state.tooltip[item]}
                                                        target="_blank">
                                                        {this.state.tooltip[item]}
                                                    </a>
                                                </li>
                                            )
                                        } 
                                        return (
                                            <li key={i}>
                                                {item}: {this.state.tooltip[item]}
                                            </li>
                                        )
                                    } 
                                    catch (e) {console.log('error', e)} 
                                })
                            }
                        </ul>
                    </ReactTooltip>
                </div>
            );
        }

        // Если у диалога есть сообщения, показываем последнее сообщение в блоке dialogs
        if (this.props.messages && this.props.messages.length) {
            // Проверяем чьё последнее сообщение
            try {
                from =
                    this.props.messages[
                        this.props.messages.length - 1
                    ].from.toLowerCase() == 'staff'
                        ? 'Вы: '
                        : '';
                // Текст последнего сообщения
                lastMessage = this.props.messages[
                    this.props.messages.length - 1
                ].text;
            } catch (e) {
                console.log('error', e);
            }
        }

        // Если диалогу назначено время решения, указываем оставшееся время в блоке dialogs
        if (this.props.solve_time) {
            overdue =
                parseInt(this.props.solve_time - Date.now() / 1000) > 0
                    ? false
                    : true;
            if (from) {
                from = '';
            }
            if (overdue) {
                lastMessage =
                    'Ответ просрочен на ' +
                    moment(this.props.solve_time * 1000).fromNow(true);
            } else {
                lastMessage =
                    'Время на ответ ' +
                    moment(this.props.solve_time * 1000).fromNow(true);
            }
        }

        if (
            this.props.user_info &&
            this.props.user_info.various1.indexOf('_') != -1
        ) {
            let wordsArr = this.props.user_info.various1.split('_');
            strategy = (
                wordsArr[0].charAt(0) + wordsArr[1].charAt(0)
            ).toUpperCase();
        }

        // Диалог заблокирован другим оператором
        if (this.state.lock && this.state.lockAnotherOperator) {
            lastMessageTime = this.props.messages.length
                ? moment(
                      this.props.messages[this.props.messages.length - 1].date *
                          1000
                  ).fromNow()
                : '0';
            li = (
                <li
                    ref="li"
                    onClick={this.onClick.bind(this)}
                    className={`${classText} ${classSearchMessage} ${
                        this.state.lockAnotherOperator
                            ? 'lockAnotherOperator'
                            : ''
                    } ${this.state.lock ? 'lock' : ''}`}
                    hidden={this.props.hidden ? true : false}
                >
                    <img src="http://placehold.it/50x50" />
                    <span className="fio">
                        {/*ФИО или прочерк*/}
                        <a
                            data-tip
                            data-for={`global${this.props.my_key}`}
                            data-event="click focus"
                            ref="dataTip2"
                        >
                            <i className="fa fa-lock" aria-hidden="true" />
                        </a>
                        {this.props.fio ? this.props.fio : '-'}
                    </span>
                    {this.props.user_phone}
                    &nbsp;
                    {strategy}
                    {tooltip}
                    <br />
                    <p
                        className={
                            this.props.solve_time
                                ? 'lastMessage solveTime'
                                : 'lastMessage'
                        }
                    >
                        <span className="from">{from != '' ? from : ''}</span>
                        {lastMessage != '' ? lastMessage : ''}
                    </p>
                    <ReactTooltip
                        refs="reactTooltip2"
                        globalEventOff="click"
                        class="extraClass"
                        id={`global${this.props.my_key}`}
                        aria-haspopup="true"
                    >
                        <span>Агент: {this.props.last_agent}</span>
                        <br />
                        <span>Последнее сообщение: {lastMessageTime}</span>
                    </ReactTooltip>
                </li>
            );
        } else {
            li = (
                <li
                    ref="li"
                    onClick={this.onClick.bind(this)}
                    className={`${classText} ${classSearchMessage} ${
                        this.state.lockAnotherOperator
                            ? 'lockAnotherOperator'
                            : ''
                    } ${this.state.lock ? 'lock' : ''}`}
                    hidden={this.props.hidden ? true : false}
                >
                    <img src="http://placehold.it/50x50" alt="" />
                    <span className="fio">
                        {/*ФИО или прочерк*/}
                        {this.props.fio ? this.props.fio : '-'}
                    </span>
                    {this.props.user_phone}
                    &nbsp;
                    {strategy}
                    {tooltip}
                    <br />
                    <p
                        className={
                            this.props.solve_time
                                ? 'lastMessage solveTime'
                                : 'lastMessage'
                        }
                    >
                        <span className="from">{from != '' ? from : ''}</span>
                        {lastMessage != '' ? lastMessage : ''}
                    </p>
                </li>
            );
        }

        return li;
    }

    componentWillUpdate() {
        console.log('tooltip', this.refs.dataTip);

        if (this.refs.dataTip) {
            console.log('reactTooltip', this.refs.dataTip.nextElementSibling);
            this.refs.dataTip.nextElementSibling.addEventListener(
                'click',
                e => {
                    e.stopPropagation();
                }
            );
        }
    }
}
