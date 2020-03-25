import React from 'react';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    timeout;

    search() {
        this.props.search(this.state.value);
    }

    onChange(e) {
        this.setState({
            value: e.target.value,
            changed: true
        });
        
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }

        this.timeout = setTimeout(() => {
            this.setState({
                changed: false
            }, () => {
                this.props.search(this.state.value);
            });
        }, 500);
    }

    resetInput() {
        this.setState({
            value: '',
            changed: false
        });
    }

    render() {
        return (
            <div className="search row">
                <input
                    type="search"
                    onChange={this.onChange.bind(this)}
                    placeholder="Поиск..."
                    value={this.state.value}
                />
                {this.state.value != '' ? (
                    <div
                        className="delete-search-text"
                        onClick={this.resetInput.bind(this)}
                    >
                        <i className="fa fa-times" aria-hidden="true" />
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }
    // После обновления компонента, проверим, изменился ли state.value, если да, то ищим
    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.value !== this.state.value &&
            this.state.changed === false
        ) {
            this.search();
        }
    }
}
