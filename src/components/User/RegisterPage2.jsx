import React, {  useState ,useContext, useEffect} from 'react';
import { Button, Col, Form, Tab, InputGroup, Row, Nav, Modal } from 'react-bootstrap';
import axios from 'axios';
import { AlertContext } from '../AlertContext';
import logo from '../../images/로고.png';
import DaumPostcode from 'react-daum-postcode';


const RegisterPage = ({history}) => {
  //주소 모달
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {setBox} = useContext(AlertContext);

  const [idCheck, setIdCheck] = useState(false); //아이디 체크
  const [workCheck,setWorkCheck] = useState(false); //사업자 조회

  const [id,setId] = useState(""); //바뀐 아이디 비교
  const [worknum, setWorkNum] = useState(""); //바뀐 사업자번호 비교
  const [address, setAddress] = useState("");

 //10자리 숫자만 입력 - 사업자번호
  const num = /^\d{10}$/; 

  //회원폼 - type default(사장)
  const [form, setForm] = useState({
    use_work_num:'',
    use_login_id:'',
    use_login_pass:'',
    use_phone:'',
    use_name:'',
    use_birth:'',
    use_address:'',
    use_email:'',   
    use_type: 1,
    passcheck:''
  });
  
  const {use_work_num, use_login_id, use_login_pass,use_phone,use_name,
  use_birth, use_address, use_email, use_type,passcheck} = form;

   //폼내용 변경
   const onChange = (e) =>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  //타입변경시 초기화
  const onChageType = (value) =>{
    setForm({
      use_work_num:'',
      use_login_id:'',
      use_login_pass:'',
      use_phone:'',
      use_name:'',
      use_birth:'',
      use_address:'',
      use_email:'',   
      use_type: value,
      passcheck:''
    })
    
  }

  //사업자 API조회 - 사업자
  const getWorkNum = async () => {
    if(!num.test(use_work_num)){
      setBox({
        show:true,
        message:"사업자 번호는 10자릿수 숫자로만 입력이 가능합니다."
      })
    }else{
        const res = await fetch(`https://bizno.net/api/fapi?key=d2tkdGtna2VrMTZAZ21haWwuY29t&gb=1&q=${use_work_num}&type=json`).
        then((res) => res.json());
        if(res === null || !res.items || res.items.length === 0){
          setBox({
            show:true,
            message:"존재하지 않는 사업자입니다."
          })
          setWorkCheck(false);
        }else{
          setBox({
            show:true,
            message: res.items[0].company+"님 환영합니다."
          })
          setWorkCheck(true);
          setWorkNum(use_work_num);
          sessionStorage.setItem("workname",res.items[0].company); //다음폼에 사업장이름 넘겨줌
        }
    }
  }

  //사업장 확인(사업자 존재) - 직원
  const getCheckWork = async() =>{
    if(!num.test(use_work_num)){
      setBox({
        show:true,
        message:"사업자 번호는 10자릿수 숫자로만 입력이 가능합니다."
      })
    }else{
      const result = await axios.get(`/workplace/about?use_work_num=${use_work_num}`);
      if(result.data.length===0){
        setBox({
          show:true,
          message:"등록되어 있지 않은 사업장입니다."
        })
        setWorkCheck(false);
      }else{
        setBox({
          show:true,
          message: result.data.work_name
        })
        setWorkCheck(true);
        setWorkNum(use_work_num);
      }
    }    
  }

  //주소검색
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';
    
    const {addressType, bname, buildingName} = data
    if (addressType === 'R') {
        if (bname !== '') {
            extraAddress += bname;
        }
        if (buildingName !== '') {
            extraAddress += `${extraAddress !== '' && ', '}${buildingName}`;
        }
        fullAddress += `${extraAddress !== '' ? ` ${extraAddress}` : ''}`;
    }
    //fullAddress -> 전체 주소반환
    setForm({
      ...form,
      use_address:fullAddress
    })
    handleClose();
}
 

  //아이디 중복체크
  const onIdCheck = async() =>{
    if (use_login_id === '') {
      setBox({ show: true, message: '아이디를 입력하세요.' });
      return;
    }else{
        const result = await axios.post(`/user/uread?use_login_id=${use_login_id}`);
        if(result.data !== ''){
          setBox({ show: true, message: '이미 사용 중인 아이디입니다' });
          return;
        }else{
          setBox({ show: true, message: '사용 가능한 아이디입니다' });
          setIdCheck(true);
          setId(use_login_id);
          return;
        }
    }
  }

  //유저등록
  const onRegister = async() =>{  
    //유효성체크
    if (use_login_id === '' || use_login_pass === '' || use_work_num=== '' ||
      use_phone==="" || use_name === "" || use_birth==="" || use_address==='' || use_email==='' ) {
        setBox({
          show:true,
          message:"필수 항목을 모두 채워주세요!"
        })
        return;
    }else if(!idCheck){
        setBox({
          show:true,
          message:"아이디 중복체크를 해주세요!"
        })
        return;
      }else if(use_login_pass !== passcheck){
        setBox({
          show:true,
          message:"비밀번호가 일치하지 않습니다!"
        })
        return;
      }else if(!workCheck){
          setBox({
            show:true,
            message:"사업자 번호를 조회해주세요!"
          })
          return;
      }else if(id!==use_login_id){ //중복확인 후 아이디 변경
        setBox({
          show:true,
          message:"아이디 중복체크를 해주세요!"
        })
        setIdCheck(false);
        return;
    }else if(worknum!==use_work_num){ //조회 후 사업자 번호변경
      setBox({
        show:true,
        message:"사업자 번호를 조회해주세요!"
      })
      setWorkCheck(false);
      return;
    }else{
      if(use_type===1){
        setBox({
          show:true,
          message:"사업자 회원으로 가입하시겠습니까?",
          action: async()=>{
            await axios.post("/user/register",form);
            history.push("/user/login");
          }
        })
      }else{
        setBox({
          show:true,
          message:"근로자 회원으로 가입하시겠습니까?",
          action: async()=>{
            await axios.post("/user/register",form);
            history.push("/user/login");
          }
        })
      }       
      }
    }       

  useEffect(()=>{
  
  },[])

  return (
   <div style={{ display: 'flex', justifyContent: 'center' }} className="join">
    <Row className="justify-content-center my-5">
      <Col lg={12} md={5} xs={8}>
      <Tab.Container  defaultActiveKey="first">
      <Row>     
          <Nav variant="pills" className="mb-3" >
            <Nav.Item>
              <Nav.Link className="master" eventKey="first" value={1} onClick={()=>onChageType(1)} >사업자</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="master" eventKey="second" value={0} onClick={()=>onChageType(0)}>근로자</Nav.Link>
            </Nav.Item>
          </Nav>   
        <Col >
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <h3 className="py-3" style={{color:"black"}}>
              <img src={logo} width='40px' alt="일해요로고"/>
                <b> 사업자 회원가입</b>
              </h3>
                <Form className="text-start text-muted">
                  <Form.Label className="mt-2">아이디</Form.Label>
                  <InputGroup>
                  <Form.Control name='use_login_id' value={use_login_id} onChange={onChange} />
                  <Button className="btn-primary" onClick={onIdCheck} >중복체크</Button>  
                  </InputGroup>

                  <Form.Label className="mt-2">비밀번호</Form.Label>
                  <InputGroup>
                  <Form.Control type="password" name='use_login_pass' value={use_login_pass} onChange={onChange} />     
                  </InputGroup>

                  <Form.Label className="mt-2"> • 비밀번호 확인</Form.Label>
                  <InputGroup>
                    <Form.Control type="password" name='passcheck' value={passcheck} onChange={onChange} />                
                  </InputGroup>
                {passcheck=== "" ? <div style={{fontSize:"12px"}} className="pt-1">&nbsp; 비밀번호를 입력해주세요</div> 
                : passcheck!==use_login_pass ?  
                <div className="pt-1" style={{fontSize:"12px", color:'red'}}>&nbsp; 비밀번호가 틀립니다!</div> 
                : <div className="pt-1" style={{fontSize:"12px", color:'blue'}}>&nbsp; 비밀번호 일치</div>
                }

                  <Form.Label className="mt-2">사업자번호</Form.Label>
                  <InputGroup>
                    <Form.Control name='use_work_num' value={use_work_num} onChange={onChange} />     
                    <Button className="btn-secondary" onClick={getWorkNum}>조회</Button>  
                  </InputGroup>

                  <Form.Label className="mt-2">이름</Form.Label>
                  <InputGroup>
                    <Form.Control name='use_name' value={use_name} onChange={onChange} />     
                  </InputGroup>

                  <Form.Label className="mt-2">전화번호</Form.Label>
                  <InputGroup>
                    <Form.Control name='use_phone' value={use_phone} onChange={onChange} />     
                  </InputGroup>

                  <Form.Label className="mt-2">주소</Form.Label>
                  <InputGroup>
                    <Form.Control name='use_address' value={use_address} onChange={onChange} /> 
                    <Button className="btn-secondary" onClick={handleShow}>검색</Button>   
                  </InputGroup>

                  <Form.Label className="mt-2">생년월일</Form.Label>
                  <InputGroup>
                    <Form.Control type="date"  name='use_birth' value={use_birth} onChange={onChange} />     
                  </InputGroup>

                  <Form.Label className="mt-2">이메일</Form.Label>
                  <InputGroup>
                    <Form.Control  name='use_email' placeholder='ex) user@naver.com' value={use_email} onChange={onChange} />      
                  </InputGroup>
                </Form>      
          <Button onClick={onRegister} className="my-5 px-3">가입하기</Button>


            </Tab.Pane>
              <Tab.Pane eventKey="second">
                <h3 className="py-3" style={{color:"black"}}>
                  <img src={logo} width='40px' alt="일해요로고"/>
                    <b> 근로자 회원가입</b>
                </h3>
              <Form className="text-start text-muted">
                  <Form.Label className="mt-2">아이디</Form.Label>
                  <InputGroup>
                  <Form.Control  name='use_login_id' value={use_login_id} onChange={onChange} />
                  <Button className="btn-primary" onClick={onIdCheck} >중복체크</Button>  
                  </InputGroup>

                  <Form.Label className="mt-2">비밀번호</Form.Label>
                  <InputGroup>
                  <Form.Control type="password" name='use_login_pass' value={use_login_pass} onChange={onChange} />     
                  </InputGroup>

                  <Form.Label className="mt-2"> • 비밀번호 확인</Form.Label>
                  <InputGroup>
                    <Form.Control type="password" name='passcheck' value={passcheck} onChange={onChange} />                
                  </InputGroup>
                {passcheck=== "" ? <div style={{fontSize:"12px"}} className="pt-1">&nbsp; 비밀번호를 입력해 주세요</div> 
                : passcheck!==use_login_pass ?  
                <div className="pt-1" style={{fontSize:"12px", color:'red'}}>&nbsp; 비밀번호가 틀립니다!</div> 
                : <div className="pt-1" style={{fontSize:"12px", color:'blue'}}>&nbsp; 비밀번호 일치</div>
                }

                  <Form.Label className="mt-2">사업자번호</Form.Label>
                  <InputGroup>
                    <Form.Control name='use_work_num' value={use_work_num} onChange={onChange} />     
                    <Button className="btn-secondary" onClick={getCheckWork}>조회</Button>  
                  </InputGroup>

                  <Form.Label className="mt-2">이름</Form.Label>
                  <InputGroup>
                    <Form.Control name='use_name' value={use_name} onChange={onChange} />     
                  </InputGroup>

                  <Form.Label className="mt-2">전화번호</Form.Label>
                  <InputGroup>
                    <Form.Control name='use_phone' value={use_phone} onChange={onChange} />     
                  </InputGroup>

                  <Form.Label className="mt-2">주소</Form.Label>
                  <InputGroup>
                    <Form.Control name='use_address' value={use_address} onChange={onChange} />
                    <Button className="btn-secondary" onClick={handleShow}>검색</Button>    
                  </InputGroup>

                  <Form.Label className="mt-2">생년월일</Form.Label>
                  <InputGroup>
                    <Form.Control type="date"  name='use_birth' value={use_birth} onChange={onChange} />     
                  </InputGroup>

                  <Form.Label className="mt-2">이메일</Form.Label>
                  <InputGroup>
                    <Form.Control  name='use_email' placeholder='ex) user@naver.com' value={use_email} onChange={onChange} />      
                  </InputGroup>
                </Form>
                <Button onClick={onRegister} className="my-5 px-3">가입하기</Button>
              </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>          
      </Col>
    </Row>

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>주소검색</Modal.Title>
        </Modal.Header>
        <Modal.Body> <DaumPostcode onComplete={handleComplete} /></Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>

   </div>
     
  )
}

export default RegisterPage