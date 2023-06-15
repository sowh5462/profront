import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import "../css/Paging.css";
import { AlertContext } from "../AlertContext";
import '../css/work.css';
import Schedule from "./component/Scheduler";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Loading from '../LoadingPage';


const WorkerList = () => {

	//데이터 저장할 변수

	const [scheList, setScheList] = useState([]); //근무자리스트
	const [worknum, setWorknum] = useState(1288663802);
	const [dayList, setDayList] = useState([]); //날짜별 근무내역
	const [show, setShow] = useState(false);
	const [uList, setUList] = useState([]);
	const { setBox } = useContext(AlertContext);
	//로딩바
	const [loading, setLoding] = useState(false);

	let [form, setForm] = useState([])

	const { use_id, sche_start, sche_end, sche_day } = form;

	//근무자 리스트
	const getList = async () => {
		
		const res = await axios.get(`/schedule/list1.json?use_work_num=${worknum}`)
		
		setScheList(res.data)
		console.log(scheList)
		
	}

	//날짜별 근무자 리스트
	const getDayScheList = async () => {
		setLoding(true);
		const dayresult = await axios.get(`/schedule/schelist?sche_start=${date}&use_work_num=${worknum}`)
		console.log(date, dayresult.data)
		setDayList(dayresult.data)
		setLoding(false);
	}

	//캘린더 날짜변수
	const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
	const [value, onChange] = useState(new Date());

	



	//캘린터 날짜 변경
	const onDayChange = (e) => {
		setLoding(true)
		const formatDate = moment(e).format("YYYY-MM-DD");
		setDate(formatDate);
		console.log(date)
		getDayScheList(date)
		setLoding(false)
	};

	let [userInfo, setUserInfo] = useState({});

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
	useEffect(() => {
		getList();
		console.log(scheList)
	}, [])

	//렌더링 분리
	useEffect(() => {
		getDayScheList();
	}, [date]);

	useEffect(() => {
		userList();
	}, [])

	if (loading) return <Loading />
	return (
		<div id="attendance">
			<div className="calendar">
				<Calendar
					onChange={onDayChange}
					value={value}
					locale="en-EN"
				/>
				<div className="staff-list">
					<h5>직원목록</h5>
					<ul>
						{dayList.map((d) =>
							<li key={d.use_id}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
									<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
									<path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
								</svg>
								<p>{d.use_name}</p>
							</li>
						)}
					</ul>
				</div>
			</div>
			<div className="schedule">
				<Schedule setContent={scheList}></Schedule>
			</div>

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
									{uList.map((u, index) =>
										<option value={u.use_id} key={index}>{u.use_id}{u.use_name}</option>
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
