import React from 'react'

import { useState } from 'react'
import { Button, Col, Form, InputGroup, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import '../css/RegisterPage.css';


const RegisterPage = ({history}) => {

  
  const [userOption, setUserOption] = useState(1);
  const [form, setForm] = useState({
    use_login_id:'',
    use_login_pass:'',
    use_work_num:'',
    use_name:'',
    use_phone:'',
    use_email:''
  });
  const [pass_check, setPass_check] = useState('');
  const {use_login_id, use_login_pass, use_work_num, use_name, use_phone, use_email} = form;

  const onNameValueChange = (e) => {
    setForm({
        ...form,
        [e.target.name]:e.target.value
    });
  }

  const RegisterUser = (value) => {
    setUserOption(value);
  }
  const onNextValue = () => {
    
    // const use_id = '';/*내가 작성한 아이디가 db에 있는 아이디라면*/
    // const use_work_num = '';/*사업자 번호가 틀린경우*/ 
    // if( use_id || use_work_num ){
    //   return;
    //} 
    
    // if(name === 'use_login_id' && value=== '' ) {
    //   alert('아이디를 입력해주세요.');
    //   return;
    //   }else if(name === 'use_login_pass' && value=== '' ){
    //     alert('비밀번호를 입력해주세요.');
    //     return;
    //   }else if(name === 'use_login_pass' && name !== 'use_check' ){
    //     alert('비밀번호가 일치하지 않습니다..');
    //     return;
    //   }else if(name === 'use_work_num' && value=== '' ){
    //     alert('사업자번호를 입력해주세요.');
    //     return;
    //   }else if(name === 'use_name' && value=== '' ){
    //     alert('이름을 입력해주세요.');
    //     return;
    //   }else if(name === 'use_phone' && value=== '' ){
    //     alert('전화번호를 입력해주세요.');
    //     return;
    //   }else if(name === 'use_email' && value=== '' ){
    //     alert('이메일을 입력해주세요.');
    //     return;
    // }else {
      if (userOption === 0) {
        history.push('/register/staff');
      } else if (userOption === 1) {
        history.push('/register/boss');
      }
  //   }
  }; 
  
  return (
    <>
      <div>
        <Row className='my-5 justify-content-center'>
          <Col md={5} className=''>
            <h1 className='text-center mb-5'>회원가입</h1>
            <Form>
              <Row>
                <ToggleButtonGroup type="radio" name="options" defaultValue={0}>
                  <ToggleButton
                    style={{
                      backgroundColor: 'white',
                      color: userOption === 1 ? '#5272E9' : 'gray',
                      border: 'none', fontSize: '30px', fontWeight: 'bold'
                    }}
                    value={1}
                    onClick={() => RegisterUser(1)}
                  >
                    사업자
                  </ToggleButton>
                  <ToggleButton
                    style={{
                      backgroundColor: 'white',
                      color: userOption === 0 ? '#5272E9' : 'gray',
                      border: 'none', fontSize: '30px', fontWeight: 'bold'
                    }}
                    value={0}
                    onClick={() => RegisterUser(0)}
                  >
                    직원
                  </ToggleButton>
                </ToggleButtonGroup>
                <Col>
                  <InputGroup className='my-4'>
                    <Form.Control size="lg" placeholder='아이디' name='use_login_id' value={use_login_id} className=' square border border-3 py-1'/>
                    <Button type="button" class="btn" style={{backgroundColor: '#5272E9', color:'white'}}>중복체크</Button> 
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='비밀번호' name='use_login_pass' value={use_login_pass} className=' square border border-3 py-1'/>
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='비밀번호확인' name='pass_check' value={pass_check} className=' square border border-3 py-1'/> 
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='사업자번호' name='use_work_num' value={use_work_num} className=' square border border-3 py-1'/>
                      <Button type="button" class="btn" style={{backgroundColor: '#5272E9', color:'white'}}>번호확인</Button> 
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='이름' name='use_name' value={use_name} className=' square border border-3 py-1'/>
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='전화번호' name='use_phone' value={use_phone} className=' square border border-3 py-1'/>
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='이메일주소' name='use_email' value={use_email} className=' square border border-3 py-1'/>
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='생년월일' name='use_birth' className=' square border border-3 py-1' />
                  </InputGroup>
                </Col>
              </Row> 
              <div className='mt-3 d-flex justify-content-end'>
                  <Button onClick={onNextValue} onChange={onNameValueChange}  style={{ backgroundColor: 'white', border: 'none', color:'#5272E9',  fontWeight: 'bold'}}>다음</Button>
              </div> 
            </Form>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default RegisterPage