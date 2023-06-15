import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Col, Row, Card, Modal, Button } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import "../css/Paging.css";
import { AiOutlineSchedule } from "react-icons/ai";
import { async } from "q";
import { AlertContext } from "../AlertContext";


const WorkerList = () => {

  //데이터 저장할 변수

  const [scheList, setScheList] = useState([]); //근무자리스트
  const [worknum, setWorknum] = useState(sessionStorage.getItem("use_work_num"));
  const [dayList, setDayList] = useState([]); //날짜별 근무내역
  const [show, setShow] = useState(false);
  const [uList, setUList] = useState([]);
  const { setBox } = useContext(AlertContext);

  const [form, setForm] = useState({
    use_id: '', sche_start: '', sche_end: '', sche_day: ''
  })

  const { use_id, sche_start, sche_end, sche_day } = form;

  //근무자리스트
  const getScheduleList = async () => {

    const result = await axios.get(`/schedule/list1.json?use_work_num=${worknum}`)
    setScheList(result.data);
    //console.log(result.data);
  }

  //날짜별 근무자 리스트
  const getDayScheList = async () => {
    const dayresult = await axios.get(`/schedule/schelist?sche_start=${date}&use_work_num=${worknum}`)
    setDayList(dayresult.data);
   // console.log(dayresult.data)
  }

  //캘린더 날짜변수
  const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [value, onChange] = useState(new Date());

  //로딩바
  const [loading, setLoading] = useState(false);



  //캘린터 날짜 변경
  const onDayChange = (e) => {
    const formatDate = moment(e).format("YYYY-MM-DD");
    setDate(formatDate);

  };

  let [userInfo, setUserInfo] = useState({});


  // let changeInfo = (key, value) => {
  //   let info = JSON.parse(JSON.stringify(userInfo))
  //   info[key] = value;
  //   setUserInfo(info)
  // }


  const handleClose = () => setShow(false);
  let showModal = (info) => {
    setShow(true)
    setUserInfo(info);
  }

  const userList = async () => {
    let response = await axios.get(`/schedule/userList?use_work_num=${worknum}`, uList)

    //    setUList(response.data);
    setUList(response.data);
  }

  //스케쥴추가하기
  const insert = async (e) => {
    e.preventDefault();
    if (sche_start === "연도-월-일") {
      setBox({
        show: true, message: "시작시간을 입력하세요."
      })
    } else {
      await axios.post(`/schedule/scheInsert`, form)
      setForm({
        use_id: '',
        sche_day: '',
        sche_start: '',
        sche_end: ''
      })
      setBox({
        show: true, message: "새로운 근무스케쥴을 등록하실래요?",
        action: getDayScheList
      })
    }
  }
  




//렌더링 분리
useEffect(() => {
  getScheduleList();
}, []);

useEffect(() => {
  getDayScheList();
}, [date]);

useEffect(() => {
  userList();
}, [])


return (
  <div>
    <Row>
      <Button className="btn-edit" onClick={() => showModal()}>추가</Button>
      <Col md={3}>
        <h1 className="text-start pb-3 fs-2">근무현황</h1>
        <Calendar
          onChange={onDayChange}
          value={value}
          locale="en-EN"
        />
      </Col>
    </Row>
    <Row className="py-3 text-start">
      <Card className="py-3">
        <Card.Body>
          <h5 className="pb-2">
            <AiOutlineSchedule /> 근무자List
            <span className="fs-6">[{date}]</span>
          </h5>
          {dayList.map((d) =>
            <div key={d.use_id}>
              •{d.use_name}
            </div>
          )}
        </Card.Body>
      </Card>
    </Row>

    <Modal
      size="xl"
      show={show}
      onHide={handleClose}
      id="edit-modal"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>스케쥴 추가</Modal.Title>
        <Modal.Body>
          <div className="form-content">
            <div className="input-form">
              <p>근무자 선택</p>
              <select value={use_id} onChange={(e) => setForm({ ...form, use_id: e.target.value })}>
                {uList.map((u) =>
                  <option value={u.use_id} key={u.use_id}>{u.use_id}{u.use_name}</option>
                )}

              </select>
            </div>
            <div className="input-form">
              <p>근무 시작 시간</p>
              <input type="date" value={sche_start} name="sche_start" onChange={(e) => setForm({ ...form, sche_start: e.target.value })} />
            </div>
            <div className="input-form">
              <p>근무 종료 시간</p>
              <input type="date" value={sche_end} name="sche_end" onChange={(e) => setForm({ ...form, sche_end: e.target.value })} />
            </div>
            <div className="input-form">
              <p>데이</p>
              <input type="text" value={sche_day} name="sche_day" onChange={(e) => setForm({ ...form, sche_day: e.target.value })} />
            </div>

          </div>

        </Modal.Body>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>취소</Button>
        <Button onClick={insert}>저장</Button>
      </Modal.Footer>
    </Modal>
  </div>


)
}

export default WorkerList