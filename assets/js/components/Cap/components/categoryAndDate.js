import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class CategoryAndDate extends React.Component {
    constructor(props) {
        super(props);
        console.log('constructor', this);
    }
    changeCategory() {
        this.props.changeCategory(this.props.phone, this.refs.category.value);
    }

    handleChange(date) {
        let minute = Math.floor((date.unix() - moment().unix()) / 60);
        console.log(minute, date.unix());
        this.props.changeDate(this.props.phone, minute, date.unix());
    }

    componentDidUpdate() {
        this.refs.category.value = this.props.category;
    }

    render() {
        console.log('thisSolvetime', this.props.solve_time);
        let date = this.props.solve_time
            ? moment(this.props.solve_time * 1000)
            : moment();
        return (
            <div className="categoryAndDate row between-xs">
                <select
                    onChange={this.changeCategory.bind(this)}
                    className="category"
                    ref="category"
                >
                    <option value="" />
                    <option value="Ошибка в отображении кредитов">
                        Ошибка в отображении кредитов
                    </option>
                    <option value="Редактирование кредита">
                        Редактирование кредита
                    </option>
                    <option value="Подробная информация о кредитах">
                        Подробная информация о кредитах
                    </option>
                    <option value="Обновление данных">Обновление данных</option>
                    <option value="Подписки">Подписки</option>
                    <option value="Редактирование личной информации">
                        Редактирование личной информации
                    </option>
                    <option value="Кредитный доктор">Кредитный доктор</option>
                    <option value="Халва">Халва</option>
                    <option value="Взять кредит">Взять кредит</option>
                    <option value="Причины отказов банков в получении кредита">
                        Причины отказов банков в получении кредита
                    </option>
                    <option value="Удаление анкеты">Удаление анкеты</option>
                    <option value="Другое">Другое</option>
                </select>
                <DatePicker
                    className="solve_time"
                    selected={date}
                    onChange={this.handleChange.bind(this)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="LLL"
                />
            </div>
        );
    }
}
