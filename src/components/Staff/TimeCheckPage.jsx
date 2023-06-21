import React, { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import SchedulePage from './SchedulePage'
import WorkTimePage from './WorkTimePage'

const TimeCheckPage = () => {
  const [key, setKey] = useState('WorkTimePage');
  return (
    <>
    <div className='my-3'>

        <Tabs
        
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        >
        <Tab eventKey="WorkTimePage" title="출퇴근관리">
            <WorkTimePage/>
        </Tab>
        
        <Tab eventKey="SchedulePage" title="스케줄관리">
            <SchedulePage/>
        </Tab>
        
        </Tabs>
      </div>
    </>
  )
}

export default TimeCheckPage