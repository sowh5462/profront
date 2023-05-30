import React from 'react'
import { Button, ButtonGroup, Col, Dropdown, DropdownButton, Form, InputGroup, Row} from 'react-bootstrap'
import '../css/RegisterPage.css';

const RegisterStaffPage = () => {
  return (
    <>
      <div>
        <Row className='my-5 justify-content-center'>
          <Col md={5} className=''>
            <h1 className='text-center mb-5'>직원 회원가입</h1>
            <Form>
              <Row>
                <Col>
                  <select class="form-select" aria-label="Default select example" name="mType">
                    <option selected disabled>은행종류</option>
                    <option value="">신한</option>
                    <option value="">신협</option>
                    <option value="">국민</option>
                    <option value="">하나</option>
                    <option value="">우리</option>
                    <option value="">기업</option>
                    <option value="">한국</option>
                    <option value="">농협</option>
                    <option value="">씨티</option>
                    <option value="">카카오뱅크</option>
                    <option value="">새마을금고</option>
                    <option value="">우체국</option>
                    <option value="">SC제일</option>
                  </select>
                  <InputGroup className='my-4'>
                      <Form.Control  placeholder='계좌번호' className=' square border border-3 py-1' />
                  </InputGroup>
                  <h4>근로형태</h4>
                  <InputGroup className=''>
                    <Form.Check className='px-3'>
                      <Form.Check.Input/>
                      <Form.Check.Label>계약직</Form.Check.Label>
                    </Form.Check>
                    <Form.Check className='px-3'>
                      <Form.Check.Input/>
                      <Form.Check.Label>정규직</Form.Check.Label>
                    </Form.Check>
                    <Form.Check className='px-3'>
                      <Form.Check.Input/>
                      <Form.Check.Label>일용직</Form.Check.Label>
                    </Form.Check>
                    <Form.Check className='px-3'>
                      <Form.Check.Input/>
                      <Form.Check.Label>아르바이트</Form.Check.Label>
                    </Form.Check>
                  </InputGroup>
                
                  <InputGroup className='my-4'>
                      <Form.Control  placeholder='입사일 ex)20230505' className=' square border border-3 py-1' />
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control  placeholder='퇴사일 ex)20230505' className=' square border border-3 py-1' />
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

export default RegisterStaffPage
