import React from 'react'
import { Button, Col, Form, InputGroup, Row} from 'react-bootstrap'

const RegisterBossPage = () => {
  return (
    <>
      <div>
        <Row className='my-5 justify-content-center'>
          <Col md={5} className=''>
            <h1 className='text-center mb-5'>사업자 회원가입</h1>
            <Form>
              <Row>
                <Col>
                  <InputGroup className='my-4'>
                    <Form.Control size="lg" placeholder='사업장명' className=' square border border-3 py-1'/>
                    <Button type="button" class="btn" style={{backgroundColor: '#5272E9', color:'white'}}>search</Button> 
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='사업장주소' className=' square border border-3 py-1' />
                  </InputGroup>
                  
                </Col>
              </Row> 
              <div className='mt-3 d-flex justify-content-center'>
                  <Button className='py-2 px-3'style={{ backgroundColor:'#5272E9', borderRadius:'15px', fontSize:'1rem'}}>가입하기</Button>
              </div> 
            </Form>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default RegisterBossPage