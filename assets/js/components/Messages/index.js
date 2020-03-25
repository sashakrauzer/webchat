import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Message from './message';
import { API_URL } from '../../constants';

export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollTopProgress: 0,
            scrollHeight: 0,
            scroll: 9999,
            loaded: false
        };
    }

    // Срабатывает после изменения реквизита у Scrollbars 
    handleScrollFrame(event) {
        console.log('handleScrollFrame', event)
        if (event.top != this.state.scrollTopProgress) {
            this.setState({
                scrollTopProgress: event.top,
                scroll: event.scrollTop,
                scrollHeight: event.scrollHeight
            });
        } else {
            this.setState({
                scroll: event.scrollTop,
                scrollHeight: event.scrollHeight
            });
        }

        const scrollHeight = this.refs.scrollbar1.getScrollHeight();
        if (this.state.scrollHeight != scrollHeight) {
            this.setState({ scrollHeight });
            this.refs.scrollbar1.scrollTop(
                scrollHeight - this.state.scrollHeight
            );
        }
    }

    componentWillReceiveProps(newProps) {
        console.log('willReceive', newProps, this.props);
        /**
         *
         * Если переключается диалог, сбрасываем state у компонента
         *
         **/
        if (
            this.props.dialog.id &&
            newProps.dialog.id != this.props.dialog.id
        ) {
            this.setState({
                scrollHeight: 0,
                scroll: 9999,
                loaded: false
            });
        }
        if (this.state.loaded) {
            this.setState({ loaded: false });
        }
    }

    render() {
        //проходим по reducer messages и для каждого запускам компонент Message
        return (
            <div>
                <div className="dialog-info">
                    <span className="fio">{this.props.dialog.fio}</span>
                    <p className="contact__number">{this.props.dialog.user_phone}</p>
                </div>
                <Scrollbars
                    onScrollFrame={this.handleScrollFrame.bind(this)}
                    className="scrollbar1"
                    ref="scrollbar1"
                >
                    <ul ref="messages" className="messages">
                        {this.props.messages.map((message, i) => (
                            <Message
                                key={i}
                                {...message}
                                dialog={this.props.dialog}
                            />
                        ))}
                    </ul>
                </Scrollbars>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        console.log('didUpdate');
        /**
         *
         *  Фиксируем скролл при подгрузке старых сообщений
         *
         */

        // при открытии диалога скроллим вниз

        if (this.state.scroll == 9999) {
            console.log('scrollTop 9999');
            this.refs.scrollbar1.scrollTop(9999);
        }

        /**
         *
         *  При скролле вверх до конца грузим старые сообщения
         *
         */
        if (
            this.state.scroll < 10 &&
            !this.state.loaded &&
            this.state.scrollHeight != 570
        ) {
            this.setState({
                loaded: true,
                scroll: 11
            });

            fetch(
                `${API_URL}getmessages/by_dialog/${this.props.dialog.id}/${
                    this.props.messages[0].uuid
                }/20`
            )
                .then(response => response.json())
                .then(result => {
                    if (!result.error) {
                        this.props.oldMessages(result);
                        //
                    } else {
                        //
                    }
                });
        }
    }
}
