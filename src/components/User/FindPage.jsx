import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Tab, Nav } from 'react-bootstrap'
import logo from '../../images/로고.png';
import { AlertContext } from '../AlertContext';

const FindPage = ({history}) => {
   const {setBox} = useContext(AlertContext);

   //폼
   const [form, setForm] = useState({
    use_name:"",
    use_phone:"",
    use_login_id:"",
   })

   const {use_name, use_phone, use_login_id} = form;

     //폼 수정
     const onChange = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

    //아이디 찾기
    const getId = async() =>{
      const result = await axios.get("/아이디 찾기 주소");
      if(!result.data){
        setBox({
          show:true,
          message:`존재하지 않는 회원입니다.`,
        })
      }else{
        setBox({
          show:true,
          message:`아이디는 : ${result.data}입니다.`,
          action:()=>{
            history.push("/user/login");
          }
        })
      }
    }

    //비밀번호 찾기
    const getPass= async() =>{
      const result = await axios.get("/비밀번호 찾기 주소");
      if(!result.data){
        setBox({
          show:true,
          message:`존재하지 않는 회원입니다.`,
        })
      }else{
        setBox({
          show:true,
          message:`비밀번호는 : ${result.data}입니다.`,
          action:()=>{
            history.push("/user/login");
          }
        })
      }
    }


  return (
      <div style={{ display: 'flex', justifyContent: 'center' }} className="join">
    <Row className="justify-content-center my-5">
      <Col lg={12} md={5} xs={8}>
      <Tab.Container  defaultActiveKey="first">
      <Row>     
          <Nav variant="pills" className="mb-3" >
            <Nav.Item>
              <Nav.Link className="master" eventKey="first" value={1}  >아이디찾기</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="master" eventKey="second" value={0} >비밀번호찾기</Nav.Link>
            </Nav.Item>
          </Nav>   
        <Col >
          <Tab.Content>
              <Tab.Pane eventKey="first">
                  <h3 className="py-3" style={{color:"black"}}>
                  <img src={logo} width='40px' alt="일해요로고"/>
                    <b>아이디찾기</b>
                  </h3>
                    <Form className="text-start text-muted">
                      <Form.Label className="mt-2">이름</Form.Label>
                      <InputGroup>
                      <Form.Control name='use_name' value={use_name} onChange={onChange} />
                      </InputGroup>

                      <Form.Label className="mt-2">전화번호</Form.Label>
                      <InputGroup>
                      <Form.Control name='use_phone' placeholder="'-'을 포함해서 입력해주세요!" value={use_phone}  onChange={onChange} />     
                      </InputGroup>
                    </Form>      
                    <Button className="my-5 px-3" onClick={getId}>찾기</Button>
                  </Tab.Pane>


                  <Tab.Pane eventKey="second">
                    <h3 className="py-3" style={{color:"black"}}>
                      <img src={logo} width='40px' alt="일해요로고"/>
                        <b>비밀번호 찾기</b>
                    </h3>
                    <Form className="text-start text-muted">
                    <Form.Label className="mt-2">아이디</Form.Label>
                      <InputGroup>
                      <Form.Control name='use_login_id' value={use_login_id}  onChange={onChange} />
                      </InputGroup>

                      <Form.Label className="mt-2">이름</Form.Label>
                      <InputGroup>
                      <Form.Control name='use_name' value={use_name}   onChange={onChange} />
                      </InputGroup>

                      <Form.Label className="mt-2">전화번호</Form.Label>
                      <InputGroup>
                      <Form.Control name='use_phone' placeholder="'-'을 포함해서 입력해주세요!" value={use_phone}  onChange={onChange} />     
                      </InputGroup>
                    </Form>      
                    <Button className="my-5 px-3" onClick={getPass}>찾기</Button>
                  </Tab.Pane>
              </Tab.Content>
            </Col>
           </Row>
        </Tab.Container>          
      </Col>
    </Row>
   </div>

  )
}

export default FindPage