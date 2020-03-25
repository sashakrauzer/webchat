import React from 'react';
import Search from './search';
import CategoryAndDate from './categoryAndDate';

export default class SearchAndCategory extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user_phone, category, solve_time } = this.props.dialog;
        return (
            <div className="row search-and-category">
                <Search search={this.props.search} />
                <CategoryAndDate
                    solve_time={solve_time}
                    phone={user_phone}
                    category={category}
                    changeCategory={this.props.changeCategory}
                    changeDate={this.props.changeDate}
                />
            </div>
        );
    }
}
