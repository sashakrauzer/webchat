import React from 'react';
import ReactModal from 'react-modal';
import { API_URL } from '../../../constants';
export default class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            showModal: false,
            solve_time: '',
            category: 0,
            amountFilter: 0,
            strategy: '',
            categories: [],
            strategies: []
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    onChange(e) {
        this.setState({ value: e.target.value });
    }

    onSolve_time(e) {
        this.setState({ solve_time: e.target.value });
    }

    onCategory(e) {
        this.setState({ category: e.target.value });
    }

    onStrategy(e) {
        this.setState({ strategy: e.target.value });
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    componentDidMount() {
        fetch(API_URL + 'chat_info')
            .then(response => response.json())
            .then(result => this.setState(result));
    }

    handleCloseModalAndFilter() {
        let count = 0;
        if (this.state.category) {
            count++;
        }
        if (this.state.solve_time) {
            count++;
        }
        if (this.state.strategy) {
            count++;
        }
        this.props.filter(
            this.state.category || undefined,
            this.state.solve_time || undefined,
            this.state.strategy || undefined
        );
        this.setState({ showModal: false, amountFilter: count });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    render() {
        let classWrapper = 'filter row end-xs ';
        classWrapper += this.state.amountFilter ? 'bg-blue' : '';
        return (
            <div className={classWrapper} onClick={this.handleOpenModal}>
                <p hidden={this.state.amountFilter ? false : true}>
                    Выбрано: {this.state.amountFilter}
                </p>
                <i
                    className="fa fa-filter"
                    aria-hidden="true"
                    style={this.state.amountFilter ? { color: 'white' } : {}}
                />
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                    className="modal modalFilter"
                    overlayClassName="overlay"
                >
                    <select
                        onChange={this.onCategory.bind(this)}
                        value={this.state.category}
                    >
                        {this.state.categories.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={this.onSolve_time.bind(this)}
                        value={this.state.solve_time}
                    >
                        <option value="">Любое время</option>
                        <option value="просроченные">Просроченные</option>
                        <option value="сегодня">Сегодня</option>
                        <option value="завтра">Завтра</option>
                        <option value="послезавтра">Послезавтра</option>
                        <option value="позднее">Позднее</option>
                    </select>
                    <select
                        onChange={this.onStrategy.bind(this)}
                        value={this.state.strategy}
                    >
                        <option value="">Все стратегии</option>
                        {this.state.strategies.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <div className="row between-xs">
                        <button
                            onClick={this.handleCloseModalAndFilter.bind(this)}
                        >
                            Фильтровать
                        </button>
                        <button onClick={this.handleCloseModal.bind(this)}>
                            Отменить
                        </button>
                    </div>
                </ReactModal>
            </div>
        );
    }
}
