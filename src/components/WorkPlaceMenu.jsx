import React, {useContext, useEffect, useState} from 'react'
import {Row,Col,Tab, Modal, Button} from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import {BiHomeAlt2, BiLogOut} from "react-icons/bi";
import {BsPeople} from "react-icons/bs";
import {MdWorkOutline} from "react-icons/md";
import {AiOutlineSchedule} from "react-icons/ai";
import {TbMoneybag} from "react-icons/tb";
import { AlertContext } from './AlertContext'
import WorkplaceInfotPage from './Master/WorkplaceInfotPage';
import AttendancePage from './Master/AttendancePage';
import PayControllPage from './Master/PayControllPage';
import axios from 'axios';

const WorkPlaceMenu = ({history}) => {
   //폼모달창
   const [show, setShow] = useState(false);
   const modalClose = () => setShow(false);
   const modalShow = () => setShow(true);
   const {setBox} = useContext(AlertContext);

   const use_id = sessionStorage.getItem("use_id");
  
  const [user, setUser] = useState([]);

  //사업장 등록 확인
  const onCheckWork = async() =>{
    const result = await axios.get(`/workplace/?use_id=${use_id}`);
    setUser(result.data);
    if(result.data.length===0){
      modalShow(true);
    }
  }

  //이동하기 버튼 클릭
  const onDirect = () =>{
    setShow(false);
    history.push("/user/register/boss");
  }

  const onHome = () =>{
    history.push("/");
  }

  //로그아웃
   const onLogout = (e) => {
    setBox({
      show:true,
      message:"로그아웃 하시겠습니까?",
      action:()=>{
        sessionStorage.removeItem("use_login_id");
        sessionStorage.removeItem("use_id");
        sessionStorage.removeItem("use_work_num");
        sessionStorage.removeItem("workname");
        history.push("/");
      }
    })
    
 }

 useEffect(()=>{
  onCheckWork();
 },[])
 
 //정보 입력 안했을 경우
  if(user==="") return (
      <Modal
        show={show}
        onHide={modalClose}
        backdrop="static"
        keyboard={false}
        >
        <Modal.Header >
          <Modal.Title>알림</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          사업장 정보를 입력하신 후 이용이 가능합니다.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onDirect}>
            정보 입력하기
          </Button>
          <Button variant="secondary" onClick={onHome}>
            홈으로 이동
          </Button>
        </Modal.Footer>
      </Modal>
  )

  return (
    <div className="content">
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#Info">
          <Row>
            <Col sm={2}>
                <div className="userbox">
                    <img src="https://audition.hanbiton.com/images/common/img_default.jpg" className="user"/>
                    {sessionStorage.getItem("use_login_id")}님
                </div>
              <ListGroup style={{textAlign:'left', fontSize:"18px"}}>

                <ListGroup.Item action href="/" className="py-3">
                  <BiHomeAlt2/> 홈화면
                </ListGroup.Item>

                <ListGroup.Item action href="#Info" className="py-3">
                  <MdWorkOutline/> 사업장정보
                </ListGroup.Item>

                <ListGroup.Item action href="/master/list" className="py-3">
                <BsPeople/> 직원관리
                </ListGroup.Item>

                <ListGroup.Item action href="#payroll" className="py-3">
                  <TbMoneybag/> 급여관리
                </ListGroup.Item>

                <ListGroup.Item action href="#attendance" className="py-3">
                  <AiOutlineSchedule/> 결재 및 근태관리
                </ListGroup.Item>

                <ListGroup.Item  className="py-3" style={{cursor:"pointer"}} onClick={onLogout}>
                  <BiLogOut/> 로그아웃
                </ListGroup.Item>

              </ListGroup>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="#link1"></Tab.Pane>
                <Tab.Pane eventKey="#Info"><WorkplaceInfotPage/></Tab.Pane>
                <Tab.Pane eventKey="#staff"></Tab.Pane>
                <Tab.Pane eventKey="#payroll"><PayControllPage/></Tab.Pane>
                <Tab.Pane eventKey="#attendance"><AttendancePage/></Tab.Pane>
              </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>

    

    </div>
    
  )
}

export default WorkPlaceMenu;