import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import User from './user';
import Search from './search';
import { API_URL } from '../../constants';

export default class Dialogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            filteredDialogsLength: 20
        };
    }

    static defaultProps = {
        limit: 20
    };

    handleScrollFrame(values) {
        if (values.top > 0.9 && !this.state.loaded) {
            this.setState({ loaded: true });

            const {
                strategy,
                category,
                from_date,
                till_date
            } = this.props.filterDialog;
            const { limit } = this.props;
            const offset = this.props.dialogs.length
                ? this.props.dialogs.length - 1
                : 0;

            // Добавляем к url гет параметры
            let url = new URL(API_URL + `dialogs/${limit}/${offset}`),
                params = {
                    category: category ? category : '',
                    strategy: strategy ? strategy : '',
                    from_date: from_date ? from_date : '',
                    till_date: till_date ? till_date : ''
                };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            fetch(url)
                .then(response => response.json())
                .then(result => {
                    if (!Array.isArray(result)) {
                        result = [];
                    }
                    return result;
                })
                .then(result => {
                    if (Array.isArray(result) && result.length > 0) {
                        this.setState({
                            loaded: false
                        });
                    }
                    this.props.getOldDialogs(result);
                });
        }
    }

    validPhone(phone) {
        return /\+\d{11}/.test(phone);
    }

    componentDidUpdate(prevProps) {
        /**
         *
         * Получаем диалоги при первой загрузке чата
         *
         */
        console.log('DIDUPDATE dialogs');

        if (this.props.filterDialog.strategy && this.props.dialogs.length !== this.state.filteredDialogsLength) {
            let dialogs = this.props.dialogs, 
            strategy = this.props.filterDialog.strategy;
            
            let filteredDialogs = dialogs.filter(dialog => dialog.strategy === strategy)
            this.setState({filteredDialogsLength: filteredDialogs.length})
            this.props.init(filteredDialogs)
            console.log('filteredDialogs', filteredDialogs)
            console.log('this.props', this.props)
            console.log('this.state.filteredDialogsLength', this.state.filteredDialogsLength)
        }

        if (!prevProps.auth.status && this.props.auth.status) {
            let self = this;
            window.onhashchange = function() {
                if (self.validPhone(document.location.hash.substr(1))) {
                    let phone = document.location.hash.substr(1);
                    self.props.openDialog(phone);
                }
            };
            const { limit, strategie, category, searchDialog } = this.props;

            const { searchText: message_search } = searchDialog;
            console.log('LIMIT', limit);
            // http://qaru.site/questions/220361/setting-query-string-using-fetch-get-request/1171052#1171052
            // Добавляем к url гет параметры
            let url = new URL(API_URL + `dialogs/${limit}/${0}`),
                params = {
                    strategy: '',
                    category: '',
                    message_search: '',
                    sort: 'asc'
                };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            fetch(url)
                .then(response => response.json())
                .then(result => {
                    if (!Array.isArray(result)) {
                        result = [];
                    }
                    return result;
                })
                .then(data => {
                    if (document.location.hash && this.validPhone(document.location.hash.substr(1))) {
                        let phone = document.location.hash.substr(1);
                        this.props.openDialog(phone);
                    }
                    this.props.init(data);
                });
        }

        // если меняются фильтры, то загружаем новые диалоги
        if (
            prevProps.filterDialog.category !=
                this.props.filterDialog.category ||
            prevProps.filterDialog.solve_time !=
                this.props.filterDialog.solve_time ||
            prevProps.filterDialog.strategy !=
                this.props.filterDialog.strategy ||
            prevProps.searchDialog.searchText !=
                this.props.searchDialog.searchText
        ) {
            const {
                strategy,
                category,
                from_date,
                till_date
            } = this.props.filterDialog;
            const { limit, searchDialog } = this.props;
            const { searchText: message_search } = searchDialog;
            const offset = 0;
            console.log('filter', {
                category: category ? category : '',
                strategy: strategy ? strategy : '',
                from_date: from_date ? from_date : '',
                till_date: till_date ? till_date : '',
                message_search: message_search ? message_search : ''
            });
            // Добавляем к url гет параметры
            let url = new URL(API_URL + `dialogs/${limit}/${offset}`),
                params = {
                    category: category ? category : '',
                    strategy: strategy ? strategy : '',
                    from_date: from_date ? from_date : '',
                    till_date: till_date ? till_date : '',
                    message_search: message_search ? message_search : ''
                };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            fetch(url)
                .then(response => response.json())
                .then(result => {
                    if (!Array.isArray(result)) {
                        result = [];
                    }
                    return result;
                })
                .then(result => {
                    this.setState({ loaded: false });
                    this.props.init(result);
                });
        } else if (
            prevProps.sortAndSearch.sort.type !=
            this.props.sortAndSearch.sort.type
        ) {
            const { limit, strategie, category, searchDialog } = this.props;

            const { searchText: message_search } = searchDialog;
            console.log('LIMIT 2', limit);
            // Добавляем к url гет параметры
            let url = new URL(API_URL + `dialogs/${limit}/0`);
            Object.keys(this.props.sortAndSearch.sort.params).forEach(key => url.searchParams.append(key, this.props.sortAndSearch.sort.params[key]));
            fetch(url)
                .then(response => response.json())
                .then(result => {
                    if (!Array.isArray(result)) {
                        result = [];
                    }
                    return result;
                })
                .then(result => {
                    this.setState({ loaded: false });
                    this.props.init(result);
                });
        }
    }

    render() {
        const messages = this.props.messages;
        const lockAndUnlock = this.props.lockAndUnlockDialog;
        const auth = this.props.auth;
        return (
            <div className="dialogs">
                <Search search={this.props.search} />
                <Scrollbars
                    onScrollFrame={this.handleScrollFrame.bind(this)}
                    style={{ width: 280, height: '100%' }}
                    className="scrollbars99"
                >
                    <ul className="dialogs">
                        {this.props.dialogs.map((user, i) => (
                            <User
                                key={i}
                                my_key={i}
                                {...user}
                                isLockedAnotherOperator={
                                    user.last_agent !==
                                    window.sessionStorage.getItem('username')
                                }
                                {...messages}
                                auth={auth}
                                {...lockAndUnlock}
                                userInfo={this.props.userInfo}
                                oldContactsResults={this.props.oldContactsResults}
                            />
                        ))}
                    </ul>
                </Scrollbars>
            </div>
        );
    }
}
