import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Button, Row, Col, Card, Form } from 'react-bootstrap'
import { AlertContext } from '../AlertContext'
import logo from '../../images/로고.png'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


const LoginPage = ({history}) => {
    const {setBox} = useContext(AlertContext);
    const [form, setForm] = useState({
        use_id:'',
        use_login_id:'',
        use_login_pass: ''
    });
    const {use_id, use_login_id, use_login_pass} = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        const res = await axios.post('/user/login', form);
        // console.log(res.data);
        if(res.data[0]===0) {
            setBox({
                show: true,
                message: '아이디가 존재하지않습니다!'
            });
        }else if(res.data[0]===2) {
            setBox({
                show: true,
                message: '비밀번호가 존재하지않습니다!'
            });
        }else if(res.data[0]===1) {
            sessionStorage.setItem('use_id', use_id);
            sessionStorage.setItem('use_login_id', use_login_id);
            if(res.data[1] === 1 ){ history.push('/user/boss')/* 사장 메인페이지 */ } else { history.push('/user/staff')/* 직원 메인페이지 */ }
        }
    }

    return (
        <div className='home-page'>
            <Row className="justify-content-center m-5">
                <Col md={6} className='p-0' style={{background:"#F0F0F0"}}>
                    <h1 className='text-center'><b>누구나</b> 쉽게 다루는<br/>아르바이트 간편 <b>매니저</b></h1>
                </Col>
                <Col md={6} className='p-0'> 
                    <Card>
                    <h1><img src={logo} width='50px'/>일해요</h1>
                        <Card.Body>
                            <Form className='text-center' onSubmit={onSubmit}>
                                <Form.Control 
                                    name="use_login_id" value={use_login_id} onChange={onChange}
                                    className='my-2'/>
                                <Form.Control 
                                    name="use_login_pass" value={use_login_pass} onChange={onChange}
                                    type="password" className='my-2'/>
                                <Button type="submit" className='px-5'>로그인</Button>
                            </Form>
                            <Col className='item'><Link to="/user/register">회원가입</Link></Col><Col className='item'><Link to="/login/find">아이디/비밀번호 찾기</Link></Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
            
    )
}

export default LoginPage