
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { AlertContext } from '../AlertContext';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const RegisterPage = ({history}) => {
  
  const [ use_type, setUse_type ] = useState (0);
  const { setBox } = useContext(AlertContext);
  const [check, setCheck] = useState(false);
  const [form, setForm] = useState({
    use_login_id: '',
    use_login_pass: '',
    use_work_num: '',
    use_name: '우람한',
    use_phone: '010-7777-8888',
    use_email: 'work007@gmail.com',
    use_birth: '1993-10-01',
    pass_check: '',
    passMatch: true,
  });

  const {
    use_login_id,
    use_login_pass,
    use_work_num,
    use_name,
    use_phone,
    use_email,
    use_birth,
    pass_check,
    passMatch,
   
  } = form;

  const onFormChange = (e) => {
    if (e.target.name === 'use_login_id') {
      setCheck(false);
      setForm({ ...form, [e.target.name]: e.target.value || '' });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

 
  

  
  const onTypeCheck = (value) => {
    setUse_type(value);
  }

  const onIdCheck = async () => {
    if (!use_login_id) {
      setBox({ show: true, message: '아이디를 입력하세요.' });
      return;
    }
    
    const result = await axios.get('/user/read?use_login_id=' + use_login_id);
    if (result.data !== '') {
      setBox({ show: true, message: '이미 사용중인 아이디입니다.' });
    } else {
      setBox({ show: true, message: '사용가능한 아이디입니다.' });
      setCheck(true);
    }
  };
  



  const onPassCheck = () => {
    if (use_login_pass !== pass_check) {
      setForm({ ...form, passMatch: false });
    } else {
      setForm({ ...form, passMatch: true });
    }
  };


  const onNextPage = async () => {
    if (!check) {
      setBox({ show: true, message: '아이디중복 체크를 해주세요.' });
      return;
    }
    if (pass_check === null || pass_check.trim() === '' || use_login_pass !== pass_check) {
      setBox({ show: true, message: '비밀번호를 확인해주세요.' });
      return;
    } else if (use_name === '') {
      setBox({ show: true, message: '이름을 확인해주세요.' });
      return;
    } else if (use_work_num === '') {
      setBox({ show: true, message: '사업자번호를 확인해주세요.' });
      return;
    } else if (use_phone === '') {
      setBox({ show: true, message: '핸드폰번호를 확인해주세요.' });
      return;
    } else if (use_email === '') {
      setBox({ show: true, message: '이메일을 확인해주세요.' });
      return;
    } else if (use_birth === '') {
      setBox({ show: true, message: '생년월일을 확인해주세요.' });
      return;
    }

    console.log('form1:', form); // form 객체 확인


    if (!check) {
      sessionStorage.setItem('use_login_id', use_login_id);
      sessionStorage.setItem('use_login_pass', use_login_pass);
      sessionStorage.setItem('use_work_num', use_work_num);
      sessionStorage.setItem('use_name', use_name);
      sessionStorage.setItem('use_phone', use_phone);
      sessionStorage.setItem('use_email', use_email);
      sessionStorage.setItem('use_birth', use_birth);
      
    }

   
  
    console.log('form2:', form);
  
    if (check) {
      const response = await axios.post('/user/register', form); 

      const userData = response.data.result;
  
      console.log('데이터 저장 완료:', userData);

    
      if (use_type === 0) {
        history.push('/user/register/staff', { formData: userData });
      } else if (use_type === 1) {
        history.push('/user/register/workplace', { formData: userData });
      }
    }
  };

  useEffect(() => {
    onPassCheck();
    }, [use_login_pass, pass_check]);

  return (
    <>
      <div>
        <Row className='my-5 justify-content-center'>
          <Col md={5}>
          <h1 className='text-center mb-5'>회원가입</h1>
            <Form>
              <Row>
              <ToggleButtonGroup type="radio" name="use_type" defaultValue={0}>
                  <ToggleButton type='radio'
                    style={{
                      backgroundColor: 'white',
                      color: use_type === 1 ? '#5272E9' : 'gray',
                      border: 'none', fontSize: '30px', fontWeight: 'bold'
                    }}
                    value={1}
                    onClick={() =>onTypeCheck(1)}
                  >
                    사업자
                  </ToggleButton>
                  <ToggleButton type='radio'
                    style={{
                      backgroundColor: 'white',
                      color: use_type === 0 ? '#5272E9' : 'gray',
                      border: 'none', fontSize: '30px', fontWeight: 'bold'
                    }}
                    value={0}
                    onClick={() => onTypeCheck(0)}
                  >
                    직원
                  </ToggleButton>
                </ToggleButtonGroup>
                <Col>
                  <InputGroup className='my-4'>
                    <Form.Control size="lg" className=' square border border-3 py-1'
                      placeholder='아이디' name='use_login_id'
                      value={use_login_id} onChange={onFormChange}/>
                  </InputGroup>
                  <Button type="button" style={{backgroundColor: '#5272E9', color:'white'}} onClick={onIdCheck} >중복체크</Button>
                  
                  <InputGroup className='my-4'>
                    <Form.Control
                      placeholder='비밀번호' type='password' size="lg"
                      name='use_login_pass' className=' square border border-3 py-1'
                      value={use_login_pass} onChange={onFormChange}/>
                  </InputGroup>
                  <InputGroup className='my-4'>
                    <Form.Control
                      size="lg" placeholder='비밀번호확인' type='password'
                      onChange={onFormChange}
                      value={pass_check} className=' square border border-3 py-1'  name='pass_check'/>
                  </InputGroup>
                  {!passMatch && <p style={{ color: 'red', fontSize: 'small'}}>비밀번호가 일치하지 않습니다.</p>}
                <InputGroup className='my-4'>
                  <Form.Control placeholder='이름' size="lg" className=' square border border-3 py-1'
                    name="use_name" value={use_name} onChange={onFormChange}/>
                </InputGroup>
                <InputGroup className='my-4'>
                  <Form.Control size="lg" placeholder='사업자번호' className='square border border-3 py-1'
                    name="use_work_num" value={use_work_num} onChange={onFormChange}/>
                </InputGroup>
                <Button>업자번호</Button>
                <InputGroup className='my-4'>
                  <Form.Control size="lg" placeholder='전화번호'
                  className=' square border border-3 py-1' 
                    name="use_phone" value={use_phone} onChange={onFormChange}/>
                </InputGroup>
                <InputGroup className='my-4'>
                  <Form.Control size="lg" placeholder='이메일주소'
                    className=' square border border-3 py-1'
                    name="use_email" value={use_email} onChange={onFormChange}/>
                </InputGroup>
                <InputGroup className='my-4'>
                  <Form.Control placeholder='생년월일' className=' square border border-3 py-1'
                    name="use_birth" value={use_birth} size="lg" onChange={onFormChange}/>
                </InputGroup>
                <div>
                <Button onClick={() => onNextPage(history)}>다음</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
    </>
  )
}

export default withRouter(RegisterPage)