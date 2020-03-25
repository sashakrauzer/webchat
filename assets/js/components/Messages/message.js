import React from 'react';
import socket from '../../websocket';
import uuid from 'uuid-v4';
import { API_URL } from '../../constants';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            newText: ''
        };
    }

    editMessageHandler (id, phone) {
        socket.send(JSON.stringify({
            method: "edit_message",
            id: uuid(),
            params: {
                phone: phone,
                message_id: id,
                text: this.state.newText
            }
        }))

        this.setState({
            edit: false,
            newText: ''
        })
    }

    deleteMessageHandler (id, phone) {
        socket.send(JSON.stringify({
            method: "delete_message",
            id: uuid(),
            params: {
                phone: phone,
                message_id: id
            }
        }))
    }

    render() {
        let time = new Date(this.props.date * 1000).toLocaleString('ru-RU', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            year: 'numeric'
        });
        let user =
            this.props.dialog.fio != ''
            ? this.props.dialog.fio
            : this.props.from;
        let sendedMessage;
        if (this.props.sended) {
            if (this.props.sended === 'in-process') {
                sendedMessage = 'in-process';
            }
            if (this.props.sended === 'fail') {
                sendedMessage = 'fail';
            }
            if (this.props.sended === 'success') {
                sendedMessage = 'success';
            }
        } else {
            sendedMessage = '';
        }

        let chanel;
        if (this.props.chanel) {
            chanel = this.props.chanel === 'chat' ? 'КИ' : 'WA';
        }

        let from = this.props.from.toLowerCase() == 'staff' ? 'staff' : 'user';

        let msg;
        if (this.props.text) {
            msg = <li style={this.state.edit ? {width:95 + '%'} : {}}>
                {
                    this.state.edit 
                    ? <textarea 
                        defaultValue={this.props.text}
                        onChange={event => this.setState({newText: event.target.value})}
                    ></textarea> 
                    : this.props.text
                    }
                {
                    from === 'staff' && !this.state.edit
                    ? <div className="staff__controls">
                        <button onClick={() => this.setState({edit: true})}>Изменить</button>
                        <button onClick={() => this.deleteMessageHandler(this.props.uuid, this.props.to)}>Удалить</button>
                    </div>
                    : null
                }
                {
                    this.state.edit && from === 'staff'
                    ? <div className="staff__controls">
                        <button onClick={() => this.editMessageHandler(this.props.uuid, this.props.to)}>Сохранить</button>
                    </div>
                    : null
                }
            </li>;
        } else if (this.props.file_path) {
            let filePath = this.props.file_path
            msg = <a target="_blank" href={API_URL + filePath.substring(1)}><img src={API_URL + filePath.substring(1)} alt={API_URL + filePath.substring(1)}/></a>;
        }
        return (
            <div className={`${from} ${sendedMessage}`}>
                <p>
                    {this.props.from.toLowerCase() === 'staff'
                        ? `Оператор, ${time}`
                        : `${user}, ${time}`}
                    <span className={`chanel ${this.props.chanel}`}>&nbsp;&nbsp;&nbsp;{chanel ? chanel : ''}</span>
                </p>
                {msg}
            </div>
        );
    }
}
