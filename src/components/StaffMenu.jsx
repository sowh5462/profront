

import React, {useContext, useState, useEffect} from 'react'
import {Row,Col,Tab, Modal, Button} from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import {BiHomeAlt2, BiLogOut} from "react-icons/bi";
import {BsPeople} from "react-icons/bs";
import {BsCalculator} from "react-icons/bs";
import {MdWorkOutline} from "react-icons/md";
import {AiOutlineSchedule} from "react-icons/ai";
import {LuCalendarClock} from "react-icons/lu"
import { AlertContext } from './AlertContext'
import StaffPage from './Staff/StaffPage';
import PayPage from './Staff/PayPage';
import CheckPage from './Staff/CheckPage';
import MyPage from './User/MyPage';
import SchedulePage from './Staff/SchedulePage';
import axios from 'axios';
import TimeCheckPage from './Staff/TimeCheckPage';


const StaffMenu = ({history}) => {
   //폼모달창
   const [show, setShow] = useState(false);
   const [user,setUser] = useState('');
   const modalClose = () => setShow(false);
   const modalShow = () => setShow(true);
   const use_login_id = sessionStorage.getItem('use_login_id');

  //알림모달
   const {setBox} = useContext(AlertContext);

   const onLogout = (e) => {
    setBox({
      show:true,
      message:"로그아웃 하시겠습니까?",
      action:()=>{
        sessionStorage.removeItem("use_login_id");
        sessionStorage.removeItem("use_id");
        sessionStorage.removeItem("use_work_num");
        history.push("/");
      }
    })
  }

    
    //직원 정보 확인
  const onCheckStaff = async() =>{
    const result = await axios.get(`/user/sread/?use_login_id=${use_login_id}`);
    setUser(result.data);
    if(result.data.length===0){
      modalShow(false);
    }
  }
    

 //이동하기 버튼 클릭
 const onDirect = () =>{
  setShow(false);
  history.push("/user/register/staff");
}

const onHome = () =>{
  history.push("/");
}
useEffect (()=>{
  onCheckStaff();
},[])




 useEffect(()=>{
  onCheckStaff();
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
          추가 정보를 입력하신 후 이용이 가능합니다.
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
  
  let activeKey = history?.location?.hash ? history.location.hash : '#Info'

  return (
    <Tab.Container className="content" defaultActiveKey={activeKey}>
    <div className="sidebar">
        <div className="userbox">
          <img src="https://audition.hanbiton.com/images/common/img_default.jpg" className="user" />
          {sessionStorage.getItem("use_login_id")}님
        </div> 
              <ListGroup style={{textAlign:'left', fontSize:"18px"}}>
                <ListGroup.Item action href="/" className="py-3">
                  <BiHomeAlt2/> 홈화면
                </ListGroup.Item>

                <ListGroup.Item action href="#Info" className="py-3">
                  <MdWorkOutline/> 근무지관리
                </ListGroup.Item>

                <ListGroup.Item action href="#worktime" className="py-3">
                  <LuCalendarClock/> 근무내역
                </ListGroup.Item>

                <ListGroup.Item action href="#check" className="py-3">
                  <AiOutlineSchedule/> 결재신청
                </ListGroup.Item>

                <ListGroup.Item action href="#payroll" className="py-3">
                  <BsCalculator/> 급여관리
                </ListGroup.Item>

                <ListGroup.Item action href="#mypage" className="py-3">
                  <BsPeople/> 마이페이지
                </ListGroup.Item>

                <ListGroup.Item  className="py-3" style={{cursor:"pointer"}} onClick={onLogout}>
                  <BiLogOut/> 로그아웃
                </ListGroup.Item>
                
              </ListGroup>
      </div>
            <div className="work-container">
              <Tab.Content>
                <Tab.Pane eventKey="#link1"></Tab.Pane>
                <Tab.Pane eventKey="#Info"><StaffPage/></Tab.Pane>
                <Tab.Pane eventKey="#worktime"><TimeCheckPage/></Tab.Pane>
                <Tab.Pane eventKey="#check"><CheckPage/></Tab.Pane>
                <Tab.Pane eventKey="#payroll"><PayPage/></Tab.Pane>
                <Tab.Pane eventKey="#mypage"><MyPage/></Tab.Pane>
              </Tab.Content>
           </div>
    </Tab.Container>
   
    
  )
}

export default StaffMenu