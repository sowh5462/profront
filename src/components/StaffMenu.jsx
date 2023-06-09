import React, {useContext} from 'react'
import {Row,Col,Tab} from 'react-bootstrap'
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


const StaffMenu = ({history}) => {
   const {setBox} = useContext(AlertContext);
   const onLogout = (e) => {
    setBox({
      show:true,
      message:"로그이웃 하시겠습니까?",
      action:()=>{
        sessionStorage.removeItem("use_login_id");
        sessionStorage.removeItem("use_id");
        sessionStorage.removeItem("use_work_num");
        history.push("/");
      }
    })
    
 }

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
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="#link1"></Tab.Pane>
                <Tab.Pane eventKey="#Info"><StaffPage/></Tab.Pane>
                <Tab.Pane eventKey="#worktime"></Tab.Pane>
                <Tab.Pane eventKey="#check"><CheckPage/></Tab.Pane>
                <Tab.Pane eventKey="#payroll"><PayPage/></Tab.Pane>
                <Tab.Pane eventKey="#mypage"><MyPage/></Tab.Pane>
              </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>
    </div>
    
  )
}

export default StaffMenu