import React from 'react';
import Select, { components } from 'react-select';
import DatePicker from 'react-datepicker';

import WithCallbacks from './WithCallbacks';

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

export default class Meeting extends React.Component {
    constructor(props) {
        super(props);
    }
    clickOutside = () => {
        this.refs.picker.cancelFocusInput();
        this.refs.picker.setOpen(false);
    };

    render() {
        return (
            <div className="row justify-content">
                <h3 className="col-md-12">Время и место встречи:</h3>
                <WithCallbacks
                    actions={this.props.actions}
                    placeholder="Город"
                    loadOptions={this.props.loadCities}
                    onChange={(data, obj) => this.props.onChangeAsync(data, obj, 'city1')}
                    colXs='col-lg-6 col-md-12'
                    noOptionsMessage="Такой город не найден"
                    value={this.props.state.city1}
                    clearValue={this.props.onClearCity}
                />
                <WithCallbacks
                    actions={this.props.actions}
                    placeholder="Станция метро, если есть"
                    loadOptions={this.props.loadStops}
                    onChange={(data, obj) => this.props.onChangeAsync(data, obj, 'stops1')}
                    colXs='col-lg-6 col-md-12'
                    value={this.props.state.stops1}
                    noOptionsMessage="Ничего не найдено"
                />
                <WithCallbacks
                    type="address"
                    actions={this.props.actions}
                    placeholder="Улица"
                    loadOptions={this.props.loadAddresses}
                    onChange={(data, obj) => this.props.onChangeAsync(data, obj, 'address')}
                    colXs='col-md-12'
                    value={this.props.state.address}
                    noOptionsMessage="Ничего не найдено"
                />
                <p className="office-placeholder">Ближайшие офисы:</p>
                <Select
                    className="react-select-container col-md-12"
                    classNamePrefix="react-select"
                    placeholder="Отделение"
                    components={{ Option }}
                    onChange={(data, obj) => this.props.onChange(data, obj, 'office')}
                    isSearchable={true}
                    options={this.props.state.offices}
                    value={this.props.state.office}
                    // menuIsOpen={true}
                    noOptionsMessage="Ничего не найдено"
                    isClearable={true}
                    // menuIsOpen={true}
                />
                <div className="col-lg-6 col-md-6">
                    <DatePicker
                        selected={this.props.state.meetingDate}
                        onChange={this.props.onChangeDate}
                        filterDate={this.props.isWeekday}
                        placeholderText="Дата встречи"
                        ref="picker"
                        onClickOutside={this.clickOutside}
                    />
                </div>
                <Select
                    className="react-select-container col-lg-6 col-md-6"
                    classNamePrefix="react-select"
                    onChange={(data, obj) => this.props.onChange(data, obj, 'interval')}
                    isSearchable={false}
                    options={this.props.state.workHours}
                    placeholder="Время встречи"
                    value={this.props.state.interval}
                    isClearable={true}
                />
                <button onClick={this.props.onSubmit} className="submit col-lg-6 col-md-12">Назначить встречу</button>
            </div>
        );
    }
}
