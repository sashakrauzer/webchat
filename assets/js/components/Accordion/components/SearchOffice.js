import React from 'react';
import Select, { components } from 'react-select';
import WithCallbacks from './WithCallbacks';
import { API_URL } from '../../../constants';

const Option = props => {
    const { innerProps, innerRef } = props;
    console.log('PROPS', props);
    return (
        <components.Option {...props}>
            <h4>{props.data.label}</h4>
            <div>{props.data.address}</div>
        </components.Option>
    );
};

let cities = [], selectedOfficesCount = 0;

export default class SearchOffice extends React.Component {
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
                cities = response;
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

    onClick = (label, address, id) => {
        let newOffices = [];
        for (let obj of this.state.offices) {
            if (obj.value === id) {
                if (obj.checked) {
                    obj.checked = false;
                    selectedOfficesCount--;
                } else {
                    if (selectedOfficesCount < 5) {
                        obj.checked = true;
                        selectedOfficesCount++;
                    }
                }
                console.log('СОВПАДЕНИЕ ID', selectedOfficesCount);
            }
            newOffices.push(obj);
        }
        this.setState({offices: newOffices});
        let selectedOffices = [];
        for (let obj of newOffices) {
            if (obj.checked) {
                selectedOffices.push(obj);
            }
        }
        this.props.actions.selectedOffices(selectedOffices);
    };

    componentWillReceiveProps(nextProps) {
        // Очищаем состояние в случае удаления офисов из хранилища
        if (nextProps.store.selectedOffices.cleared) {
            console.log('!!!!componentWillReceiveProps');
            selectedOfficesCount = 0;
            this.setState({
                city1: null,
                office: null,
                stops1: null,
                meetingDate: null,
                address: null,
                interval: null,
                offices: [{}],
                workHours: []
            });
        }
    }

    render() {
        return (
            <div className="row justify-content search-office">
                <WithCallbacks
                    placeholder="Город"
                    loadOptions={this.loadCities}
                    onChange={(data, obj) => this.onChangeAsync(data, obj, 'city1')}
                    colXs='col-lg-6 col-md-12'
                    noOptionsMessage="Такой город не найден"
                    value={this.state.city1}
                />
                <WithCallbacks
                    placeholder="Станция метро, если есть"
                    loadOptions={this.loadStops}
                    onChange={(data, obj) => this.onChangeAsync(data, obj, 'stops1')}
                    colXs='col-lg-6 col-md-12'
                    value={this.state.stops1}
                    noOptionsMessage="Ничего не найдено"
                />
                <WithCallbacks
                    placeholder="Улица"
                    loadOptions={this.loadAddresses}
                    onChange={(data, obj) => this.onChangeAsync(data, obj, 'address')}
                    colXs='col-md-12'
                    value={this.state.address}
                    noOptionsMessage="Ничего не найдено"
                />
                <p className="office-placeholder">Ближайшие офисы:</p>
                <ul className="offices-list">
                    {this.state.offices.length ? this.state.offices.map((elem, i) => {
                        return <li key={i} onClick={() => this.onClick(elem.label, elem.address, elem.value)} className={elem.checked ? 'checked' : ''}><h4>{elem.label}</h4><p>{elem.address}</p></li>;
                    }) : ''}
                </ul>
            </div>
        );
    }
}
