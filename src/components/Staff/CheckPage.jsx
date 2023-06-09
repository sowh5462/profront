import React,{ useState, useEffect } from 'react'
import { Col, Row, Card, Tab, Tabs, Button, Table, Form} from "react-bootstrap";
import axios from 'axios';

const CheckPage = () => {
    /*
        넘겨줘야하는 값 - use_id, chk_confirm = 0,
        chk_type, chk_time, chk_start, chk_end, use_work_num
    */

    //체크박스
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const handleCheckboxChange = (event) => {
        setSelectedCheckbox(event.target.value);
        console.log(event.target.value)
    };

    //유저정보
    const [user,setUser] = useState("");
    const id = sessionStorage.getItem("use_login_id")
    const getUser = async() =>{
        const result = await axios.get(`/user/uread?use_login_id=${id}`);
        setUser(result.data);
    }

    useEffect(()=>{
        getUser();
    },[])

    return (
        <div className="back">
            <div className="back2">               
            <Tabs defaultActiveKey="tab1" className="pt-3 ps-2">
                <Tab eventKey="tab1" title="연장/조퇴/대체" className="p-5">
                    <Row>
                        <Col>
                            <Form className="text-start">
                            <Form.Check
                                type="checkbox"
                                id="option1"
                                label="연장"
                                value="연장"
                                checked={selectedCheckbox === '연장'}
                                onChange={handleCheckboxChange}
                            />

                            <Form.Check
                                type="checkbox"
                                id="option2"
                                label="조퇴"
                                value="조퇴"
                                checked={selectedCheckbox === '조퇴'}
                                onChange={handleCheckboxChange}
                            />

                            <Form.Check
                                type="checkbox"
                                id="option3"
                                label="대체"
                                value="대체"
                                checked={selectedCheckbox === '대체'}
                                onChange={handleCheckboxChange}
                            />
                            </Form>
                        </Col>
                    </Row>
                    <Row className="text-start">
                        <div>
                            신청자 {user.use_name}
                        </div>
                        <div>
                            근로형태 {user.use_type===0 ? '계약직' : user.use_type===1 ?"정규직" :"일용직"}
                        </div>
                    </Row>
                </Tab>
                <Tab eventKey="tab2" title="연차신청" className="p-5"></Tab>
            </Tabs>
            </div>
        </div>
    )
}

export default CheckPage