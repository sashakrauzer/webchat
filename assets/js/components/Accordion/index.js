import React from 'react';

import {
    Accordion as Accord,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody
} from 'react-accessible-accordion';

import SearchOffice from './components/SearchOffice';
import Result from './components/Result';

export default class Accordion extends React.Component {
    constructor(props) {
        super(props);
    }

    getOldContactsResultsDate(int) {
        let date = new Date(int * 1000)
        let dd = date.getDate();
        if (dd < 10) dd = `0${dd}`;

        let mm = date.getMonth() + 1;
        if (mm < 10) mm = `0${mm}`;

        let yy = date.getFullYear() % 100;
        if (yy < 10) yy = `0${yy}`;

        return `${dd}.${mm}.${yy}`
    }

    renderOldContactsResults(result,index) {

        let date = this.getOldContactsResultsDate(result.added)

        const type = result.type

        return <li key={index}><span>{date}</span><div>{type}</div></li>
    }

    render() {
        let userInfo = Object.keys(this.props.store.userInfo).length ? this.props.store.userInfo : '';
        let oldContactsResults = this.props.store.oldContactsResults.length ? this.props.store.oldContactsResults : '';
        let userInfoArr, userInfoTitle;
        if (userInfo) {
            userInfoTitle = Object.keys(userInfo);
            userInfoArr = Object.keys(userInfo).map(elem => {
                return userInfo[elem];
            });
        }
        return (
            <Accord>
                <AccordionItem expanded={true}>
                    <AccordionItemTitle>
                        <h3>
                            Информация пользователя
                            <div className="accordion__arrow" />
                        </h3>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        {
                            oldContactsResults 
                            ? <Accord>
                                <AccordionItem>
                                    <AccordionItemTitle>
                                        <h3>
                                            Результаты контактности
                                    <div className="accordion__arrow" />
                                        </h3>
                                    </AccordionItemTitle>
                                    <AccordionItemBody>
                                        <ul className="old-contacts-results">
                                            {oldContactsResults.map((res, index) => this.renderOldContactsResults(res, index))}
                                        </ul>
                                    </AccordionItemBody>
                                </AccordionItem>
                            </Accord>
                            : null
                        }
                        <ul className="user-info">
                            {userInfoArr ? userInfoArr.map((elem, i) => {
                                if (typeof elem.value === 'string' && elem.value.indexOf('http') === 0) {
                                    return <li key={i}><span>{elem.title}</span><div><a href={elem.value} target="_blank">{elem.value}</a></div></li>;
                                }
                                return <li key={i}><span>{elem.title}</span><div>{elem.value}</div></li>;
                            }) : ''}
                        </ul>
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h3>
                            Поиск отделения
                            <div className="accordion__arrow" />
                        </h3>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <SearchOffice actions={this.props.actions} store={this.props.store} />
                    </AccordionItemBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemTitle>
                        <h3>
                            Результат контактности
                            <div className="accordion__arrow" />
                        </h3>
                    </AccordionItemTitle>
                    <AccordionItemBody>
                        <Result actions={this.props.actions} store={this.props.store}/>
                    </AccordionItemBody>
                </AccordionItem>
            </Accord>
        );
    }
}
