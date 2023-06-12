import axios from 'axios';
import React, { useEffect, useState, useContext} from 'react';
import 'react-calendar/dist/Calendar.css';
import {Row, Col, Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { AlertContext } from '../AlertContext';

const CheckannualPage = () => {
    const {setBox} = useContext(AlertContext);
    const [form, setForm] = useState({
        
    })

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
        <>
        <Row>
            <Col>
            <Form className="text-start">
            <Form.Group as={Form.Row}>
                <Form.Label as={Col} sm={2}>
                <h4 className="mb-3 ps-2" style={{borderLeft:"solid 5px gray"}}>연차신청</h4>
                </Form.Label>
                <Col sm={10}>
                </Col>
                </Form.Group>
                </Form>

                </Col>
        </Row>
        <Row className="text-start my-3">
            <Col md={5}>
                <div className="mb-3">
                <b>신청자</b> {user.use_name}
                </div>
                <hr/>
                <div>
                    <b>근로계약형태</b> 
                    <br/>
                    <div className="mt-2">
                        {user.use_type===0 ? '계약직' : user.use_type===1 ?"정규직" :"일용직"}
                    </div>
                </div>
            </Col>                       
        </Row>
        <Row>
            <Col md={6}>
                <Form className="my-3">
                <h4 className="text-start mb-4">📝 신청서작성</h4>    
                <Form.Group as={Row} className="mb-2">
                    <Col sm="3">
                    <Form.Control placeholder="신청일수" />
                    </Col>
                </Form.Group>           
                <Form.Group as={Row} className="mb-2">
                    <Col sm="7">
                        <InputGroup className="mb-2">
                            <InputGroup.Text>시작일</InputGroup.Text>
                            <Form.Control type="date"/>
                        </InputGroup>    
                    </Col>
                </Form.Group>    
                <Form.Group as={Row} className="mb-2">
                    <Col sm="7">
                        <InputGroup className="mb-2">
                            <InputGroup.Text>종료일</InputGroup.Text>
                            <Form.Control type="date"/>
                        </InputGroup>    
                        <Button className="px-4 my-3" style={{fontWeight:"500"}}>신청</Button>
                    </Col>
                </Form.Group>    
            
                </Form>
               
            </Col>
        </Row>
    </>
  )
}

export default CheckannualPage