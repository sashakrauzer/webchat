import React, { Component } from 'react';

import AsyncSelect from 'react-select/lib/Async';

export default class WithCallbacks extends Component {
    state = { inputValue: '' };
    handleInputChange = (newValue: string, twoArgument) => {
        console.log('twoArgument', twoArgument, newValue);
        const inputValue = newValue.replace(/[^ a-zа-яё\d]/gi, '');
        this.setState({ inputValue });
        return;
    };

    onChange = (data, { action }) => {
        console.log('onChange', data, action);
        if (action === 'select-option') {
            this.props.actions.selectCity(data.value, this.props.type);
            if (this.props.onChange) {
                this.props.onChange(data.office);
            }
        } else if (action === 'clear') {
            // Очищаем поле и состояние
            this.props.actions.selectCity('', this.props.type);
        }
    };
    render() {
        return (
            <AsyncSelect
                className={`react-select-container ${this.props.colXs}`}
                classNamePrefix="react-select"
                cacheOptions
                isClearable={true}
                loadOptions={this.props.loadOptions}
                defaultOptions={[]}
                onInputChange={this.handleInputChange}
                onChange={this.props.onChange}
                placeholder={this.props.placeholder}
                loadingMessage={() => 'Загрузка'}
                noOptionsMessage={() => this.props.noOptionsMessage}
                value={this.props.value}
            />
        );
    }
}
