import React from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import PayRollPage from './PayRollPage';
import PayStubPage from './PayStubPage';

const PayControllPage = () => {
  return (
    <Tabs
      defaultActiveKey="PayRoll"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="PayRoll" title="인건비관리">
        <PayRollPage/>
      </Tab>
      <Tab eventKey="PayStub" title="급여명세서">
        <PayStubPage/>
      </Tab>
    </Tabs>
  )
}

export default PayControllPage