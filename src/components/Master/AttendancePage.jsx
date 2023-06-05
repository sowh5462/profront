import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Col, Row, Card, Tab, Tabs, Button, Spinner} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import Pagination from "react-js-pagination";
import "../Paging.css";
import { AiOutlineSchedule } from "react-icons/ai";
import { AlertContext } from '../AlertContext';
import Modal from 'react-bootstrap/Modal';
import dayjs from 'dayjs';

const AttendancePage = () => {
  //로딩바
  const [loading,setLoading] = useState(false);

  //폼모달창
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
   
  const {setBox} = useContext(AlertContext);

  //데이터 저장할 변수
  const [staff, setStaff] = useState([]); //직원목록
  const [worknum, setWorknum] = useState(1288663802);
  const [dayList, setDayList] = useState([]); //날짜별 결재내역
  const [confirm, setConfirm] = useState([]); //직원별 결재여부
  const [check,setCheck] = useState({}); //결재 상세내역

  //캘린더 날짜변수
  const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [value, onChange] = useState(new Date());

  //페이징
  const [page, setPage] = useState(1);
  const size = 6;
  const [count, setCount] = useState(1);

  //페이징하기 위한 직원수
  const staffCount = async () => {
    const sresult = await axios.get(`/payroll/total?use_work_num=${worknum}`);
    setCount(sresult.data);
  };

  //직원 리스트(연차정보)
  const getStaffList = async () => {
    const result = await axios.get(`/check/list.json?use_work_num=${worknum}&page=${page}&size=${size}`);
    setStaff(result.data); //직원리스트 정보
    const id = result.data.map((item) => item.use_id); // 직원 ID만 추출하여 배열로 저장
    await Promise.all(id.map(checkConfirm)); // 모든 직원 ID에 대해 결재 여부 확인
  };

  //유저별 신청내역 조회 - 버튼
  const checkConfirm = async (use_id) => {
    const conresult = await axios.get(`/check/confirm?use_id=${use_id}`);
    if (conresult.data >= 1) {
      setConfirm((prevConfirm) => [...prevConfirm, { id: use_id, ok: 1 }]);
    }
  };

  //유저별 결재상세내역
  const checkUser = async(use_id) =>{
    const uresult = await axios.get(`/check/user?use_id=${use_id}`);
    setCheck(uresult.data[0]);
    modalShow();
  }

  //날짜별 결재 내역
  const getDayCheckList = async () => {
    const dayresult = await axios.get(
      `/check/daylist?chk_day=${date}&use_work_num=${worknum}`);
    setDayList(dayresult.data);
  };

	//select박스 필터링
	const onFilter = async(chk_confirm) =>{
		if(chk_confirm==="0"){ //전체보기
			staffCount();
			getStaffList();
		}else{ //승인중
			const fresult = await axios.get(`/check/filter?chk_confirm=${chk_confirm}&use_work_num=${worknum}`);
			const id = fresult.data.map((item) => item.use_id);
			await Promise.all(id.map(checkConfirm));		
			setStaff(fresult.data);
      setCount(fresult.data.length);
      setPage(1);
		}		
	}

	//결재승인
	const onPermit = async(chk_code, use_id) =>{
		await axios.post(`/check/update`,{chk_confirm:2,chk_code:chk_code});
    setConfirm((prevConfirm) =>
    prevConfirm.filter((c) => c.id !== use_id)
  );
    modalClose();
		getStaffList();
	} 

	//결재반려
	const onReject = async(chk_code,use_id) =>{
    await axios.post(`/check/update`,{chk_confirm:3,chk_code:chk_code});
    setConfirm((prevConfirm) =>
    prevConfirm.filter((c) => c.id !== use_id)
  );
    modalClose();
		getStaffList();
	} 

  //캘린터 날짜 변경
  const onDayChange = (e) => {
    const formatDate = moment(e).format("YYYY-MM-DD");
    setDate(formatDate);
  };

  //스케줄과 직원리스트페이지 렌더링 분리
  useEffect(() => {   
    getDayCheckList();
  }, [date]);

  useEffect(()=>{
		staffCount();
    getStaffList();
  },[page])

  return (
    <div className="back">
      <div className="back2">
        <Tabs defaultActiveKey="tab1" className="pt-3 ps-2">
          <Tab eventKey="tab1" title="근무현황" className="p-5"></Tab>
          <Tab eventKey="tab2" title="결재 및 연차관리" className="p-5">
            <Row>
              <Col md={3}>
                <h1 className="text-start pb-3 fs-2">결재 및 연차관리</h1>								
                  <Row>
                    <Calendar
                      onChange={onDayChange}
                      value={value}
                      locale="en-EN"
                    />
                  </Row>
                  <Row className="py-3 text-start">
                    <Card className="py-3">
                      <Card.Body>
                        <h5 className="pb-2">
                          <AiOutlineSchedule /> 결재리스트
                          <span className="fs-6">[{date}]</span>
                        </h5>
                        <div>
                          {dayList.map((d) => (
                            <div key={d.use_id}>
                              • {d.use_name} <span>({d.chk_type}신청서)</span>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Row>
              </Col>
              <Col md={6}>
                  <div style={{ float: "right" }} className="pb-4">
                    <select className="form-select" onChange={(e)=>onFilter(e.target.value)}>
                      <option value="0">전체보기</option>
                      <option value="1">신청중</option>
                      <option value="2">승인완료</option>
                      <option value="3">반려</option>
                    </select>
                  </div>
                  <Row style={{ width: "100%" }}>
                    {staff.map((s) => (
                      <Col md={6} key={s.use_id}>
                        <Row className="px-2">
                            <Card style={{padding:0}} className="mb-3 mx-3">
                                <Card.Body className="py-4">
                                    <Row>
                                        <Col md={3}>
                                            <div>
                                              <img
                                                src="https://audition.hanbiton.com/images/common/img_default.jpg"
                                                className="checkUser"
                                                alt="직원이미지"
                                              />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="text-start">
                                                <h5>
                                                  {s.use_name}
                                                  <span className="fs-6">
                                                    ({s.use_login_id})
                                                  </span>
                                                </h5>
                                                <div className="pb-2">
                                                  근로형태:
                                                  {s.sta_type === 0 ? " 정규직" : " 계약직"}
                                                </div>
                                                <div style={{color:"#4286ED"}}>
                                                  잔여연차 {s.sta_annual}일 
                                                  {confirm.some((c) => c.id === s.use_id && c.ok === 1) && (
                                                    <button className="chkBtn" onClick={()=>checkUser(s.use_id)}>신청중</button>
                                                  )}                                  
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer className="fs-6"><b>입사일&nbsp;</b> {s.start}</Card.Footer>
                            </Card>
                        </Row>
                    </Col>
                  ))}
                  <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={count}
                    pageRangeDisplayed={3}
                    prevPageText={"<"}
                    nextPageText={">"}
                    onChange={setPage}
                  />
                </Row>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </div>
        <Modal
        show={show}
        onHide={modalClose}
        backdrop="static"
        keyboard={false}
        >
          <Modal.Header closeButton>
              <Modal.Title>
                ☑︎결재내역
                <span className="fs-6 ps-3">[{dayjs(check.chk_day).format('YYYY-MM-DD')}]</span>
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {check.chk_type==="연차" ?
								<Row className="ps-3">
										<Row>
											<Col className="col-4"><b>성명</b></Col>
											<Col className="col-4"><b>종류</b></Col>
										</Row>
										<Row className="pb-3 text-secondary"> 
											<Col className="col-4">{check.use_name}</Col>
											<Col className="col-4">{check.chk_type}</Col>
										</Row>
										<Row >
											<Col><b>시작일</b></Col>
											<Col><b>종료일</b></Col>
											<Col><b>신청일수</b></Col>
										</Row>
										<Row className="pb-3 text-secondary">
											<Col>{check.start}</Col>
											<Col>{check.end}</Col>
											<Col>{dayjs(check.chk_end).diff(dayjs(check.chk_start), 'day') + 1}</Col>
										</Row>
									<div>
										{/*사유*/}
									</div>
								</Row>
								:
								<div>
									결재내역
								</div>
							} 
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={()=>onPermit(check.chk_code, check.use_id)}>승인</Button>
            <Button variant="danger" onClick={()=>onReject(check.chk_code,check.use_id)}>반려</Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
};

export default AttendancePage;
