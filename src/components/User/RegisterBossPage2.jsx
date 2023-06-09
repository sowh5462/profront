import React, {  useState ,useContext} from 'react';
import { Button, Col, Form, InputGroup, Row} from 'react-bootstrap';
import { AlertContext } from '../AlertContext';
import logo from '../../images/로고.png';
import axios from 'axios';

const RegisterBossPage2 = ({history}) => {
  const {setBox} = useContext(AlertContext);

  //회원폼 - default(사장)
  const [form, setForm] = useState({
    use_id:sessionStorage.getItem("use_id"),
    use_work_num:sessionStorage.getItem("use_work_num"),
    work_address:'',
    work_name:sessionStorage.getItem("workname")
  });
  
  const {use_work_num, work_address, work_name} = form;

   //폼내용 변경
   const onChange = (e) =>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  //등록하기 버튼
  const onRegister = () =>{
    if(work_address==="" || work_name===""){
      setBox({
        show:true,
        message:"정보를 빠짐없이 작성해 주세요!"
      })
    }else{
      setBox({
        show:true,
        message:"사업장을 등록하시겠습니까?",
        action: async()=>{
          await axios.post(`/user/register/workplace`,form);
          history.push("/workplace");
        }
      })
    }   
  }

  return (
    <div className='join'>
    <Row className="justify-content-center my-5">  
                <h3 className="py-3" style={{color:"black"}}>
                <img src={logo} style={{width:"40px"}}alt="일해요로고"/>
                  <b>사업장 정보입력</b>
                </h3>      
            <Col md={10} xs={8}>                     
                  <Form className="text-start text-muted">
                    <Form.Label className="mt-2">사업자번호</Form.Label>
                    <InputGroup>
                      <Form.Control name='use_work_num' value={use_work_num} readOnly/>     
                    </InputGroup>
                    <Form.Label className="mt-2">사업장명</Form.Label>
                    <InputGroup>
                      <Form.Control name='work_name' value={work_name} onChange={onChange} />     
                    </InputGroup>
                    <Form.Label className="mt-2">사업자주소</Form.Label>
                    <InputGroup>
                      <Form.Control name='work_address' value={work_address} onChange={onChange} />     
                    </InputGroup>
                </Form>      
            <Button className="my-5 px-3" onClick={onRegister}>등록하기</Button>        
          </Col>
   
    </Row>
   </div>
  )
}

export default RegisterBossPage2