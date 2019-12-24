// base
import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import "react-tabs/style/react-tabs.css";

import TransactionsComponentTable from "./TransactionsComponentTable";

const TransactionsComponent = (props) => {
    if (!props.tab) {
        return (
            <TransactionsComponentTable props={props}/>
        )
    } else {
        return (
            <>
                <Tabs defaultIndex={0} onSelect={index => props.tabOnSelect(index)}>
                    <TabList>
                        <Tab>General Transactions</Tab>
                        <Tab>Join Transactions</Tab>
                        <Tab>Contract</Tab>
                    </TabList>
                    <TabPanel>
                        <TransactionsComponentTable props={props} txType='transfer'/>
                    </TabPanel>
                    <TabPanel>
                        <TransactionsComponentTable props={props} txType='jointx'/>
                    </TabPanel>
                    <TabPanel>
                        <TransactionsComponentTable props={props} txType='contract'/>
                    </TabPanel>
                </Tabs>
            </>
        );
    }
};

TransactionsComponent.defaultProps = {
    tab: false,
    pageName: '',
    type: 'full',
    transactions: [],
};


export default TransactionsComponent
