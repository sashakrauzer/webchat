import React from 'react';

export default class Time extends React.Component {
    constructor(props) {
        super(props);
        let options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        };
        this.state = {
            time: new Date().toLocaleString('ru-RU', options)
        };
    }

    clock() {
        let options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        };
        this.setState({
            time: new Date().toLocaleString('ru-RU', options)
        });
    }

    render() {
        return (
            <div className="time">
                {this.state.time.charAt(0).toUpperCase() +
                    this.state.time.substr(1)}
            </div>
        );
    }

    componentDidMount() {
        setInterval(this.clock.bind(this), 1000);
    }
}
