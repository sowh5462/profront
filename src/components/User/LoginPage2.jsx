import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Row, Col,Form } from 'react-bootstrap'
import { AlertContext } from '../AlertContext'
import logo from '../../images/로고.png'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import '../css/Home.css';


const LoginPage2 = ({history}) => {
    const {setBox} = useContext(AlertContext);
    const [form, setForm] = useState({
        use_login_id:'',
        use_login_pass: '',
    });
    
    const {use_login_id, use_login_pass} = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        const res = await axios.post('/user/login', form);      
        console.log(res.data);
        if(res.data.status===0) {
            setBox({
                show: true,
                message: '아이디가 존재하지 않습니다!'
            });
        }else if(res.data.status===2) {
            setBox({
                show: true,
                message: '비밀번호가 틀립니다'
            });
        }else if(res.data.status===1) {
            sessionStorage.setItem('use_login_id', use_login_id);
            sessionStorage.setItem('use_id', res.data.use_id);
            sessionStorage.setItem('use_work_num', res.data.use_work_num);
            if(res.data.role===1){
                history.push('/workplace'); //사장페이지
            }else{
                history.push('/staff'); //직원페이지
            } 
        }
    }

    return (
      <div className='home-page'>
        <Row className='justify-content-center'>
            <Col md={6} className='text-center content'>
                <div className="title">
                  <h1 className='text-center htitle py-3'><b>누구나</b> 쉽게 다루는<br/>아르바이트 간편 <b>매니저</b></h1>
                </div>
            </Col>
            <Col md={6} className='d-flex align-items-center'>
                <div style={{ width: '100%', position: 'relative'}}>
                    <h1 className="ltitle pe-4">
                      <img src={logo} width='60px' alt="일해요로고"/> <b> 일해요</b>
                    </h1>
                    <div className="loginbox">
                        <Form className='text-center' onSubmit={onSubmit}>
                            <Form.Control 
                              name="use_login_id" value={use_login_id} onChange={onChange}
                              placeholder='id'
                              className='mb-4 py-3'/>
                            <Form.Control 
                              name="use_login_pass" value={use_login_pass} onChange={onChange}
                              type="password" className='mb-4 py-3'
                              placeholder='password'/>
                            <button type="submit" className='w-100 py-3 '><b>로그인</b></button>                                             
                        </Form>
                        <div className="jbox">
                            <span className="float-start">
                              <Link to="/user/register" className="text-decoration-none join">회원가입</Link>
                            </span>
                            <span className="float-end">
                              <Link to="/login/find" className="text-decoration-none join">아이디 / 비밀번호 찾기</Link>
                            </span>
                        </div>      
                    </div>               
                </div>
            </Col>
        </Row>         
    </div>
    
    )
}

export default LoginPage2