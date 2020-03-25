import React from 'react';
import Select, { components } from 'react-select';

const options = [
    {
        label: 'Сначала новые',
        value: 'firstNew',
        params: {
            sort: 'asc'
        },
        isSelected: true
    },
    {
        label: 'Сначала старые',
        value: 'firstOld',
        params: {
            sort: 'desc'
        }
    }
];

export default class Sort extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            interval: {
                from_date: null,
                till_date: null
            }
        };
    }

    onChange = (data, { action }) => {
        if (action === 'select-option') {
            let action = this.props.actions[data.value];
            action(data.params);
            console.log('SORT onChange', data.value, action);
        }
        if (action === 'clear') {
            console.log('SORT clear');
        }
    };

    render() {
        return (
            <Select
                className="react-select-container"
                classNamePrefix="react-select"
                options={options}
                onChange={this.onChange}
                placeholder="Сортировка"
                isSearchable={false}
                defaultValue={options[0]}
            />
        );
    }
}
