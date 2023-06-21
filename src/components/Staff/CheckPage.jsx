import React from 'react'
import { Tab, Tabs} from "react-bootstrap";
import CheckdayPage from './CheckdayPage';
import CheckannualPage from './CheckannualPage';
import CheckListPage from './CheckListPage';

const CheckPage = () => {
    /*
        넘겨줘야하는 값 - use_id, chk_confirm = 0,
        chk_type, chk_time, chk_start, chk_end, use_work_num
    */
 
        return (
            <div className="back">
                <div className="back2">               
                <Tabs defaultActiveKey="tab1" className="pt-3 ps-2">
                    <Tab eventKey="tab1" title="연장/조퇴/대체" className="p-5">
                        <CheckdayPage/>
                    </Tab>
                    <Tab eventKey="tab2" title="연차신청" className="p-5">
                        <CheckannualPage/>
                    </Tab>
                    <Tab eventKey="tab3" title="신청내역" className="p-5">
                        <CheckListPage/>
                    </Tab>
                </Tabs>
                </div>
            </div>
        )
    }

export default CheckPage