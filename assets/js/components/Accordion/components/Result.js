import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ResultModal from './ResultModal';

import Meeting from './ResultMeeting';

import { API_URL } from '../../../constants';

const options = [
    { value: 'meeting', label: 'Назначена встреча' },
    { value: 'clientRefusal', label: 'Отказ клиента' },
    { value: 'bankRefusal', label: 'Отказ банка' },
    { value: 'contactLater', label: 'Связаться позже' }
];

let cities = [];

export default class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            office: null,
            city1: null,
            stops1: null,
            offices: [{}],
            meetingDate: null,
            contactLaterDate: null,
            comment: '',
            workHours: [],
            weekday: '',
            address: null,
            interval: null,
            submitStatus: null
        };
    }

    // Получаем города
    loadCities = (inputValue, callback) => {
        if (inputValue.length < 3) {
            return false;
        }
        const getCities = () => {
            return cities.map(i => {
                return {
                    value: i.id,
                    label: i.name,
                    source: i
                };
            });
        };
        fetch(`${API_URL}cities?name=${inputValue}`)
            .then(response => {
                // Если не 404 или 500
                if (response.ok) {
                    return response.json();
                } else {
                    // Ошибка
                }
            })
            .then(response => {
                cities = response;
                callback(getCities());
            });
    };

    loadStops = (inputValue, callback) => {
        if (inputValue.length < 3) {
            return false;
        }
        const getCities = () => {
            return cities.map(i => {
                return {
                    value: i.id,
                    label: i.name,
                    source: i
                };
            });
        };
        fetch(
            `${API_URL}cities/${
                this.state.city1.value
            }/stops?name=${inputValue}`
        )
            .then(response => {
                // Если не 404 или 500
                if (response.ok) {
                    return response.json();
                } else {
                    // Ошибка
                }
            })
            .then(response => {
                cities = response;
                callback(getCities());
            });
    };

    loadAddresses = (inputValue, callback) => {
        console.log('loadAddresses');
        if (inputValue.length < 3) {
            return false;
        }
        const getCities = () => {
            return cities.map(i => {
                return {
                    value: i,
                    label: i,
                    source: i
                };
            });
        };
        fetch(
            `${API_URL}cities/${
                this.state.city1.value
            }/addresses?name=${inputValue}`
        )
            .then(response => {
                // Если не 404 или 500
                if (response.ok) {
                    return response.json();
                } else {
                    // Ошибка
                }
            })
            .then(response => {
                // sdff
                cities = response;
                // console.log('response', response);
                callback(getCities());
            });
    };

    loadOffices2 = () => {
        console.log('LOAD OFFICES2', this.state);
        const getCities = response => {
            return response.map(i => {
                return {
                    value: i.id,
                    label: i.name,
                    address: i.address,
                    source: i
                };
            });
        };
        fetch(
            `${API_URL}offices/${this.state.city1.value}?stop_id=${this.state.stops1 ? this.state.stops1.value : ''}&address=${this.state.address ? this.state.address.value : ''}`
        )
            .then(response => {
                // Если не 404 или 500
                if (response.ok) {
                    return response.json();
                } else {
                    // Ошибка
                    throw new Error('Ошибка! Не удалось получить отделения.');
                }
            })
            .then(response => {
                console.log('Delivered offices', response, getCities(response));
                this.setState({
                    offices: getCities(response)
                });
            });
    };

    closeModal = () => {
        this.setState({
            submitStatus: null,
            office: null,
            city1: null,
            stops1: null,
            offices: [{}],
            meetingDate: null,
            contactLaterDate: null,
            comment: '',
            workHours: [],
            weekday: '',
            address: null,
            interval: null
        });
    };

    onChangeDate = date => {
        console.log('onChangeDate', date);
        let type = this.props.store.contactResult.type;
        if (type === 'meeting') {
            let workHours = this.state.office.source.work_hours[date.weekday()];
            let interval = [];
            for (let i = 0; i < workHours.length; i++) {
                interval.push({
                    label: workHours[i],
                    value: workHours[i]
                });
            }
            this.setState({
                meetingDate: date,
                weekday: date.weekday(),
                workHours: interval
            });
        } else if (type === 'contactLater') {
            this.setState({
                contactLaterDate: date
            });
        }
    };

    isWeekday = date => {
        if (
            this.state.office &&
            this.state.office.source.work_hours[date.day()] &&
            date.valueOf() > moment().valueOf() - 86400000
        ) {
            return true;
        } else {
            return false;
        }
    };

    onChange = (data, { action }, type) => {
        if (action === 'select-option') {
            if (type === 'office') {
                this.setState({
                    [type]: data
                });
            } else {
                this.setState({
                    [type]: data
                });
            }
        } else if (action === 'clear') {
            console.log('CLEAR', type);
            this.setState({
                [type]: null
            });
        }
    };

    onChangeType = (data, { action }) => {
        if (action === 'select-option') {
            this.props.actions.setType(data.value);
            this.setState({
                type: data.value
            });
        }
    };

    onChangeAsync = (data, { action }, type) => {
        console.log('onChangeAsync', data, action, type);
        if (action === 'select-option') {
            if (type === 'city1') {
                this.setState({ [type]: data }, () => {
                    this.loadOffices2();
                });
            } else {
                this.setState({ [type]: data }, () => {
                    this.loadOffices2();
                });
            }
        } else if (action === 'clear') {
            // Очищаем поле и состояние
            if (type === 'city1') {
                this.setState({
                    [type]: null,
                    office: null,
                    stops1: null,
                    meetingDate: null,
                    address: null,
                    interval: null,
                    offices: [{}],
                    workHours: []
                });
            } else {
                this.setState({ [type]: null }, () => {
                    this.loadOffices2();
                });
            }
        }
    };

    onChangeTextArea = event => {
        this.setState({
            comment: event.target.value
        });
    };

    onSubmit = () => {
        // Сохранение результата контактности
        let type = this.props.store.contactResult.type;
        if (type === 'meeting') {
            let phone = this.props.store.dialog.user_phone;
            let chanel = 'chat';
            if (this.props.store.messages.length) {
                chanel = this.props.store.messages[0].chanel ? this.props.store.messages[0].chanel : 'chat';
            }
            console.log('SUBMIT meeting', `phone ${phone}; chanel ${chanel}; type ${type}; officeID ${this.state.office.value}; date ${this.state.meetingDate}; interval ${this.state.interval.value};`);
            if (phone) {
                this.setState({
                    submitStatus: 'sending'
                });
                fetch(`${API_URL}dialog/contact-result`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: phone,
                        chanel: chanel,
                        type: type,
                        officeId: this.state.office.value,
                        date: this.state.meetingDate.valueOf(),
                        interval: this.state.interval.value
                    })
                }).then(response => {
                    if (response.ok) {
                        this.setState({
                            submitStatus: 'sended'
                        });
                        console.log('Результат контактности сохранен');
                    } else {
                        this.setState({
                            submitStatus: 'error'
                        });
                        throw new Error('Результат контактности не сохранен!');
                    }
                });
            } else {
                throw new Error('Выберите диалог');
            }
        } else if (type === 'clientRefusal' || type === 'bankRefusal') {
            let phone = this.props.store.dialog.user_phone;
            let chanel = 'chat';
            if (this.props.store.messages.length) {
                chanel = this.props.store.messages[0].chanel ? this.props.store.messages[0].chanel : 'chat';
            }
            if (phone) {
                this.setState({
                    submitStatus: 'sending'
                });
                fetch(`${API_URL}dialog/contact-result`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: phone,
                        chanel: chanel,
                        type: type,
                        comment: this.state.comment
                    })
                }).then(response => {
                    if (response.ok) {
                        this.setState({
                            submitStatus: 'sended'
                        });
                        console.log('Результат контактности сохранен');
                    } else {
                        this.setState({
                            submitStatus: 'error'
                        });
                        throw new Error('Результат контактности не сохранен!');
                    }
                });
            } else {
                throw new Error('Выберите диалог');
            }
        } else if (type === 'contactLater') {
            let phone = this.props.store.dialog.user_phone;
            let chanel = 'chat';
            if (this.props.store.messages.length) {
                chanel = this.props.store.messages[0].chanel ? this.props.store.messages[0].chanel : 'chat';
            }
            if (phone) {
                this.setState({
                    submitStatus: 'sending'
                });
                fetch(`${API_URL}dialog/contact-result`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: phone,
                        chanel: chanel,
                        type: type,
                        comment: this.state.comment,
                        date: this.state.contactLaterDate.valueOf()
                    })
                }).then(response => {
                    if (response.ok) {
                        this.setState({
                            submitStatus: 'sended'
                        });
                        console.log('Результат контактности сохранен');
                    } else {
                        this.setState({
                            submitStatus: 'error'
                        });
                        throw new Error('Результат контактности не сохранен!');
                    }
                });
            } else {
                throw new Error('Выберите диалог');
            }
        }
    };

    render() {
        let content;
        switch (this.props.store.contactResult.type) {
            case 'meeting':
                content = (
                    <Meeting
                        actions={this.props.actions}
                        onSubmit={this.onSubmit}
                        onChange={this.onChange}
                        onChangeDate={this.onChangeDate}
                        loadCities={this.loadCities}
                        loadAddresses={this.loadAddresses}
                        loadOffices={this.loadOffices}
                        loadStops={this.loadStops}
                        state={this.state}
                        isWeekday={this.isWeekday}
                        onChangeAsync={this.onChangeAsync}
                        onClearCity={this.onClearSelect}
                    />
                );
                break;
            case 'bankRefusal':
                content = (
                    <BankRefusal
                        actions={this.props.actions}
                        onSubmit={this.onSubmit}
                        onChange={this.onChangeTextArea}
                        state={this.state}
                    />
                );
                break;
            case 'clientRefusal':
                content = (
                    <ClientRefusal
                        actions={this.props.actions}
                        onSubmit={this.onSubmit}
                        onChange={this.onChangeTextArea}
                        state={this.state}
                    />
                );
                break;
            case 'contactLater':
                content = (
                    <ContactLater
                        actions={this.props.actions}
                        onChangeDate={this.onChangeDate}
                        state={this.state}
                        onSubmit={this.onSubmit}
                        onChange={this.onChangeTextArea}
                    />
                );
                break;
            default:
                content = <div />;
        }
        return (
            <div className="result">
                <TypeSelect actions={this.props.actions} state={this.state} onChange={this.onChangeType} />
                {content}
                <ResultModal
                    state={this.state}
                    closeModal={this.closeModal}
                    phone={this.props.store.dialog.user_phone}
                    fio={this.props.store.dialog.fio}
                    date={this.state.meetingDate ? this.state.meetingDate.format('LL') : null}
                    interval={this.state.interval ? this.state.interval.value : null}
                    officeName={this.state.office ? this.state.office.label : null}
                    address={this.state.office ? this.state.office.address : null}
                    comment={this.state.comment}
                    dateWithTime={this.state.contactLaterDate ? this.state.contactLaterDate.format('LLL') : null}
                />
            </div>
        );
    }

    componentDidUpdate() {
        console.log('didUpdate');
    }
}

function TypeSelect(props) {
    return (
        <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={options}
            onChange={props.onChange}
            placeholder="Выберите..."
        />
    );
}

function ContactLater(props) {
    let filterOlderDates = date => {
        if (moment() > date) {
            return false;
        }
        return true;
    };
    return (
        <div className="contact-later">
            <h3>Следующий контакт с клиентом:</h3>
            <div className="row">
                <DatePicker
                    selected={props.state.contactLaterDate}
                    onChange={props.onChangeDate}
                    filterDate={filterOlderDates}
                    // showTimeSelect
                    placeholderText="Дата следующего контакта"
                    dateFormat="MMMM D, YYYY"
                />
                <DatePicker
                    selected={props.state.contactLaterDate}
                    onChange={props.onChangeDate}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    locale="ru-RU"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    timeCaption="Time"
                    className="time-picker"
                    placeholderText="Время следующего контакта"
                />
            </div>
            <textarea onChange={props.onChange} value={props.state.comment} placeholder="Текст комментария" />
            <button onClick={props.onSubmit} className="submit col-lg-6 col-md-12">Отправить</button>
        </div>
    );
}

function BankRefusal(props) {
    return (
        <div>
            <h3>Комментарий оператора:</h3>
            <textarea onChange={props.onChange} value={props.state.comment} placeholder="Текст комментария" />
            <button onClick={props.onSubmit} className="submit col-lg-6 col-md-12">Отправить</button>
        </div>
    );
}

function ClientRefusal(props) {
    return (
        <div>
            <h3>Комментарий оператора:</h3>
            <textarea onChange={props.onChange} value={props.state.comment} placeholder="Текст комментария" />
            <button onClick={props.onSubmit} className="submit col-lg-6 col-md-12">Отправить</button>
        </div>
    );
}
