import React from 'react';
import Filter from './components/filter';
import LogIn from './components/logIn';
import CategoryAndDate from './components/categoryAndDate';
import Sort from './components/Sort';

export default class Cap extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user_phone, category, solve_time } = this.props.dialog;
        return (
            <div className="row cap between-xs">
                <LogIn auth={this.props.auth} logIn={this.props.logIn} />
                <CategoryAndDate
                    solve_time={solve_time}
                    phone={user_phone}
                    category={category}
                    changeCategory={this.props.changeCategory}
                    changeDate={this.props.changeDate}
                />
                <Filter filter={this.props.filter} />
                <Sort actions={this.props.actions} />
            </div>
        );
    }
}
