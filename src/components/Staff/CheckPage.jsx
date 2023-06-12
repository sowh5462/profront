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
                        <Form.Group as={Form.Row}>
                            <Form.Label as={Col} sm={2}>
                            <h4>신청서구분</h4>
                            </Form.Label>
                            <Col sm={10}>
                            <Form.Check
                                inline
                                type="checkbox"
                                id="option1"
                                label="연장"
                                value="연장"
                                checked={selectedCheckbox === '연장'}
                                onChange={handleCheckboxChange}
                            />

                            <Form.Check
                                inline
                                type="checkbox"
                                id="option2"
                                label="조퇴"
                                value="조퇴"
                                checked={selectedCheckbox === '조퇴'}
                                onChange={handleCheckboxChange}
                            />

                            <Form.Check
                                inline
                                type="checkbox"
                                id="option3"
                                label="대체"
                                value="대체"
                                checked={selectedCheckbox === '대체'}
                                onChange={handleCheckboxChange}
                            />
                            </Col>
                        </Form.Group>
                        </Form>

                        </Col>
                    </Row>
                    <Row className="text-start my-3">
                        <div className="mb-3">
                          <b>신청자</b> {user.use_name}
                        </div>
                        <hr/>
                        <div>
                          <b>근로형태</b> {user.use_type===0 ? '계약직' : user.use_type===1 ?"정규직" :"일용직"}
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