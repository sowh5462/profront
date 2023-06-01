import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'

const MyPage = () => {
    const [form, setForm] = useState({
        use_login_id:'',
        use_login_pass:'',
        use_work_num:'',
        use_name:'',
        use_birth:'',
        use_address:'',
        use_email:'',
        use_join:'',
        use_type:'',
        use_phone:'',
        sta_bank:'',
        sta_account:'',
        sta_type:'',
        sta_image:'',
        sta_employ:'',
        sta_end:'',
        sta_contract:'',
        start:'',
        end: '',
        ujoin:''
    });
    const {use_login_id, use_login_pass, use_work_num, use_name, use_birth, use_address, use_email, use_join, use_type, use_phone, sta_bank, sta_account, sta_type,
         sta_image, sta_employ, sta_end, sta_contract, start, end, ujoin} = form;
    const getUser = async () => {
        const result = await axios.get(
        `/user/sread?use_login_id=${sessionStorage.getItem('use_login_id')}`);
        setForm(result.data);
    }
    useEffect(() => {
        getUser();
    },[])
    


  return (
    <div>
        <div>
            <h4 className="text-start">마이페이지</h4>
        </div>
        <Row className='justify-content-center m-5'>
            <Col>
                <Card>
                    <h3><b>{use_name}</b>님의 정보</h3>
                    <Form>
                        <h5 className='text-start'>계좌정보</h5>
                        <Form.Control placeholder='은행'/><Form.Control placeholder='계좌'/>
                    </Form>
                </Card>
            </Col>
        </Row>
        <Row className='justify-content-center m-5'>
            <Card>
                <h4 className='text-start'>직장관리</h4>
                    <Row>
                <Col md={6}>
                    <Card>
                        <Button>사업장정보</Button>
                    </Card>
                    <Card>
                        <h1>근로계약서 파일</h1>
                    </Card>
                </Col><Col>
                    <Card>
                        <h1>사업장 주소</h1>
                            
                    </Card>
                    <Card>
                        <Button className='btn btn-secondary' name='sta_type'>{sta_type}</Button>
                    </Card>
                    <Card>
                        <Button>가입일 : {start}</Button>
                    </Card>
                    <Card>
                        <Button>퇴사일 : {end}</Button>
                    </Card>
                </Col>
                </Row>
            </Card>
            
        </Row>
    </div>
  )
}

export default MyPage