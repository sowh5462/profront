import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import home from '../images/홈페이지1.png'
import { Link, withRouter } from 'react-router-dom';
import './css/Home.css';
import axios from 'axios';

const HomePage = () => {
    const [type,setType] = useState("");
    const id = sessionStorage.getItem("use_login_id")
    const getUser = async() =>{
        const result = await axios.get(`/user/uread?use_login_id=${id}`);
        setType(result.data.use_type);
    }
    useEffect(()=>{
        getUser();
    },[])
  return (
    <div className='home-page'>
        <Row className='justify-content-center'>
            <Col md={6} className='text-center content' >
                <div className="title">
                    <h1 className='text-center htitle py-5'><b>누구나</b> 쉽게 다루는<br/>아르바이트 간편 <b>매니저</b></h1>
                    <Link  to={type===1 ? "/workplace" : type===0 ? "/staff" : "/user/login"}>
                        <button className='hbtn'>일해요 이용하기</button>
                    </Link>
                </div>
            </Col>
            <Col md={6} className="p-0" style={{ position: 'relative' }}>
               <div className="right">
                    <img className="main" src={home} alt="메인이미지"/>
               </div>
            </Col>
        </Row>
            
    </div>
    )
}

export default withRouter(HomePage)