import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import home from '../images/홈페이지1.png'
import { Link, withRouter } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className='home-page'>
        <Row className='justify-content-center'>
            <Col md={6} className='text-center' style={{background:"#F0F0F0"}}>
                    <h1 className='text-center htitle'><b>누구나</b> 쉽게 다루는<br/>아르바이트 간편 <b>매니저</b></h1>
                <Link to="/user/login">
                    <button className='btn btn-secondary px-5 py-2'>일해요 이용하기</button>
                </Link>
            </Col>
            <Col md={6} className="p-0">
                <img src={home} width='100%'  style={{ objectFit: 'cover' }}/>
            </Col>
        </Row>
            
    </div>
    )
}

export default withRouter(HomePage)