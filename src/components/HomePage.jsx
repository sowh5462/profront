import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import home from '../images/홈페이지1.png'
import { Link, withRouter } from 'react-router-dom';

const HomePage = () => {
  return (
        <Row className='justify-content-center m-5'>
            <Col className='text-center' style={{background:"#F0F0F0"}}>
                    <h1 className='text-center'><b>누구나</b> 쉽게 다루는<br/>아르바이트 간편 <b>매니저</b></h1>
                <Link to="/user/login">
                    <button className='btn btn-secondary px-5 py-2'>일해요 이용하기</button>
                </Link>
            </Col>
            <Col>
                <Card>
                <img src={home} width='100%'/>
                </Card>
            </Col>
        </Row>
    )
}

export default withRouter(HomePage)