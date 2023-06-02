import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'

const BossMyPage = ({history}) => {
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
        work_address:'',
        work_name:''
    });
    const {use_login_id, use_login_pass, use_work_num, use_name, use_birth, use_address, use_email, use_join, use_type, use_phone, work_address, work_name} = form;
    const getUser = async () => {
        const result = await axios.get(
        `/user/wread?use_login_id=${sessionStorage.getItem('use_login_id')}`);
        setForm(result.data);
    }
    useEffect(() => {
        getUser();
    },[])
    const onChange = (e) =>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        if(!window.confirm('정보를 수정 할까요?')) return;
        await axios.post('/user/wupdate', form);
        history.push('/');
    }


  return (
    <div>
        <div>
            <h4 className="text-start">마이페이지</h4>
        </div>
        <Row className='justify-content-center m-5'>
            <Col>
                <Card>
                    <Card.Title>
                        <h3><b>{use_name}</b>님의 정보</h3>
                    </Card.Title>
                    <Card.Body>
                        <Form onSubmit={onSubmit}>
                            <Form.Control placeholder='아이디' onChange={onChange}
                                value={use_login_id} name='use_login_id'
                                className='mb-3'/>
                            <Form.Control placeholder='비밀번호' onChange={onChange}
                                value={use_login_pass} type='password' name='use_login_pass'
                                className='mb-3'/>
                            <Form.Control placeholder='주소' onChange={onChange}
                                value={use_address} name='use_address'
                                className='mb-3'/>
                            <Form.Control placeholder='이메일' onChange={onChange}
                                value={use_email} name='use_email'
                                className='mb-3'/>
                            <Form.Control placeholder='전화번호' onChange={onChange}
                                value={use_phone} name='use_phone'
                                className='mb-3'/>
                            <hr/>
                            <Button type='submit'>정보수정</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default BossMyPage