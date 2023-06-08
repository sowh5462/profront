import React, {useContext} from 'react'
import {Row,Col,Tab} from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import {BiHomeAlt2, BiLogOut} from "react-icons/bi";
import {BsPeople} from "react-icons/bs";
import {MdWorkOutline} from "react-icons/md";
import {AiOutlineSchedule} from "react-icons/ai";
import {TbMoneybag} from "react-icons/tb";
import { AlertContext } from './AlertContext'
import WorkplaceInfotPage from './Master/WorkplaceInfotPage';
import AttendancePage from './Master/AttendancePage';

const WorkPlaceMenu = ({history}) => {
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
                  <MdWorkOutline/> 사업장정보
                </ListGroup.Item>

                <ListGroup.Item action href="#staff" className="py-3">
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
                <Tab.Pane eventKey="#payroll"></Tab.Pane>
                <Tab.Pane eventKey="#attendance"><AttendancePage/></Tab.Pane>
              </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>
    </div>
    
  )
}

export default WorkPlaceMenu;