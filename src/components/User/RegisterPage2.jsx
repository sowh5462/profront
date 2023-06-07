import React, { useEffect, useState ,useContext} from 'react';
import { Button, Col, Form, InputGroup, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import axios from 'axios';
import { AlertContext } from '../AlertContext';

const RegisterPage = ({history}) => {
  const {setBox} = useContext(AlertContext);

  //회원폼
  const [form, setForm] = useState({
    use_work_num:'',
    use_login_id:'',
    use_login_pass:'',
    use_phone:'',
    use_name:'',
    use_birth:'',
    use_address:'',
    use_email:'',   
    use_type: ''
  });
  
  const {use_work_num, use_login_id, use_login_pass,use_phone,use_name,
    use_birth, use_address, use_email, use_type} = form;

  //사업자폼
  const [workform, setWorkForm] = useState({
    use_work_num2:use_work_num,
    use_id:'',
    work_address:'',
    work_name:''
  })

  const {use_work_num2,use_id,work_address, work_name} = workform;

  //폼내용 변경 -> 사업자 폼에 사업자번호 넘겨줌
  const onChange = (e) =>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
    setWorkForm({
      ...workform,
      use_work_num2:use_work_num
    })
  }

  const onwChange = (e) =>{
    setWorkForm({
      ...workform,
      [e.target.name]:e.target.value
    })
  }

  //마지막 use_id인덱스 가져와 다음 번호에 넣음
  const getUserId = async () => {
    const res = await axios.get(`/user/lastnum`);
    setWorkForm({
      ...workform,
      use_id: res.data+1
    })
    
  }

  //유저등록
  const onRegister = async() =>{  
      await axios.post("/user/register",form)
      await onworkRegister();
      // console.log(form);
      // console.log(workform);
  }

  //사업자 등록
  const onworkRegister = async() =>{
    await axios.post("/user/register/workplace",
    {"use_work_num2":use_work_num2,"use_id":use_id,"work_address":work_address,"work_name":work_name})
  }

  //직원 등록

  useEffect(()=>{ 
    getUserId(); 
  },[])


  return (
   <>
    <Row className="justify-content-center">
      <Col md={4}>

          <ToggleButtonGroup type="radio" name="options" defaultValue={0}>
              <ToggleButton value={1} onClick={() => setForm({...form, use_type:1})}>
                사업자
              </ToggleButton>
              <ToggleButton value={0} onClick={() => setForm({...form, use_type:0})}>
                직원
              </ToggleButton>
            </ToggleButtonGroup>
            
          <Form>
            <InputGroup className='my-4'>
              <Form.Control placeholder='아이디' name='use_login_id' value={use_login_id} onChange={onChange} />     
              <Button type="button" >중복체크</Button>  
            </InputGroup>
            <InputGroup className='my-4'>
              <Form.Control placeholder='비밀번호' name='use_login_pass' value={use_login_pass} onChange={onChange} />     
            </InputGroup>
            <InputGroup className='my-4'>
              <Form.Control placeholder='사업자번호' name='use_work_num' value={use_work_num} onChange={onChange} />     
              <Button type="button" >유효성확인</Button>  
            </InputGroup>
            <InputGroup className='my-4'>
              <Form.Control placeholder='이름' name='use_name' value={use_name} onChange={onChange} />     
            </InputGroup>
            <InputGroup className='my-4'>
              <Form.Control placeholder='전화번호' name='use_phone' value={use_phone} onChange={onChange} />     
            </InputGroup>
            <InputGroup className='my-4'>
              <Form.Control placeholder='주소' name='use_address' value={use_address} onChange={onChange} />     
            </InputGroup>
            <InputGroup className='my-4'>
              <Form.Control placeholder='생년월일' name='use_birth' value={use_birth} onChange={onChange} />     
            </InputGroup>
            <InputGroup className='my-4'>
              <Form.Control placeholder='이메일' name='use_email' value={use_email} onChange={onChange} />     
            </InputGroup>
          </Form>
          {use_type===1 ? 
          <Form>
            <InputGroup className='my-4'>
              <Form.Control placeholder='사업장주소' name='work_address' value={work_address} onChange={onwChange} />     
            </InputGroup>
            <InputGroup className='my-4'>
              <Form.Control placeholder='사업장명' name='work_name' value={work_name} onChange={onwChange} />     
            </InputGroup>
          </Form>
        :
          <Form>
              <InputGroup className='my-4'>
                <Form.Control placeholder='직원페이지' name='work_address' value={work_address} onChange={onwChange} />     
              </InputGroup>
              <InputGroup className='my-4'>
                <Form.Control placeholder='직원페이지' name='work_name' value={work_name} onChange={onwChange} />     
              </InputGroup>
          </Form>
        }
          <Button onClick={onRegister}>등록</Button>
      </Col>
    </Row>
   </>
     
  )
}

export default RegisterPage