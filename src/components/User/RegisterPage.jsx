import React, { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import axios from 'axios';





const RegisterPage = ({history}) => {
 
  const [useType, setUseType] = useState('');
  const [idCheck, setIdCheck] = useState(false);
  const [passCheck, setPassCheck] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '' });

  

  
  const [form, setForm] = useState({
    use_login_id:'',
    use_login_pass:'',
    use_work_num:'',
    use_name:'',
    use_phone:'',
    use_email:'',
    use_birth:''
  });

  const {use_login_id, use_login_pass, use_work_num, use_name, use_phone, use_email, use_birth} = form;
  
  const onRegisterUser = (value) => {
    setUseType(Number(value));
  };
  
  const onCheck = (e) => {
    setIdCheck(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };


 
  const onIdCheck = async () => {
    if (use_login_id === '') {
      setNotification({ show: true, message: '아이디를 입력하세요.' });
      return;
    }
    //const result = await axios.post('/register?use_login_id=' + use_login_id);
    const result = await axios.post('/register', { use_login_id: use_login_id });


    if (result.data !== '') {
      setNotification({ show: true, message: '이미 사용중인 아이디입니다.' });
    } else {
      setNotification({ show: true, message: '사용가능한 아이디입니다.' });
      setIdCheck(true);
    }
  };
  
  const onNextPage = () => {
    const target = useType === 0 ? '/register/staff' : '/register/workplace';
    sessionStorage.setItem('target', target);
    history.push(target);
  };
  const onNext = () => {
    if (!idCheck) {
      setNotification({
        show: true,
        message: '아이디 중복체크를 하세요.'
      });
    } else if (use_login_pass !== passCheck) {
      setNotification({
        show: true,
        message: '비밀번호가 일치하지 않습니다.'
      });
    } else if(use_birth = ''){
      alert('생일입력 ㄱ');
    } else if(use_phone){
      alert('폰입력 ㄱ')
    } else if(use_email){
      alert('이멜입력 ㄱ')
    } else {
      onNextPage();
    }
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
                      color: useType === 1 ? '#5272E9' : 'gray',
                      border: 'none', fontSize: '30px', fontWeight: 'bold'
                    }}
                    value={1}
                    onClick={() => onRegisterUser(1)}
                  >
                    사업자
                  </ToggleButton>
                  <ToggleButton
                    style={{
                      backgroundColor: 'white',
                      color: useType === 0 ? '#5272E9' : 'gray',
                      border: 'none', fontSize: '30px', fontWeight: 'bold'
                    }}
                    value={0}
                    onClick={() => onRegisterUser(0)}
                  >
                    직원
                  </ToggleButton>
                </ToggleButtonGroup>
            
                <Col>
                  <InputGroup className='my-4'>
                    <Form.Control size="lg" placeholder='아이디' name='use_login_id' value={use_login_id} className=' square border border-3 py-1' onChange={onCheck} />
                  </InputGroup>
                  <InputGroup>
                    <Button type="button" style={{backgroundColor: '#5272E9', color:'white'}} onClick={onIdCheck} >중복체크</Button>  
                  </InputGroup>
                  
                </Col>
              </Row> 

                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='비밀번호' type='password' name='use_login_pass' value={use_login_pass} className=' square border border-3 py-1' onChange={onCheck}/>
                  </InputGroup>
                  <InputGroup className='my-4'>
                    <Form.Control size="lg" placeholder='비밀번호확인'  name='passCheck' value={passCheck} onChange={(e) => setPassCheck(e.target.value)} type='password'
                      className=' square border border-3 py-1' />
                  </InputGroup>
                  <InputGroup className='my-4'>
                    <Form.Control size="lg" placeholder='사업자번호' name='use_work_num' value={use_work_num} className='square border border-3 py-1' onChange={onCheck}/>
                  </InputGroup>
                  <InputGroup>
                    <Button type="button" className="btn" style={{ backgroundColor: '#5272E9', color: 'white' }}>번호확인</Button>
                  </InputGroup>
                  
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='이름' name='use_name' value={use_name}  className=' square border border-3 py-1' onChange={onCheck}/>
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='전화번호' name='use_phone' value={use_phone}  className=' square border border-3 py-1' onChange={onCheck}/>
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='이메일주소' name='use_email' value={use_email}  className=' square border border-3 py-1' onChange={onCheck}/>
                  </InputGroup>
                  <InputGroup className='my-4'>
                      <Form.Control size="lg" placeholder='생년월일' name='use_birth' value={use_birth}  className=' square border border-3 py-1' onChange={onCheck} />
                  </InputGroup>
                
              
              <div className='mt-3 d-flex justify-content-end'>
              <Button
                style={{ backgroundColor: 'white', border: 'none', color:'#5272E9',  fontWeight: 'bold'}}
                onClick={onNext}>다음</Button>
      
              </div> 
            </Form>
          </Col>
        </Row>
        {notification.show && (
          <div className="notification-box">
            <p>{notification.message}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default RegisterPage