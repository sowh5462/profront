import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, Row, Table, Modal } from 'react-bootstrap'


import { AlertContext } from '../AlertContext';

//기본 유저 리스트 
let orgUserList = [];

//
const MasterListPage = () => {
  const { setBox } = useContext(AlertContext);
  const [UserList, setUserList] = useState([]);
  let [selected, setSelected] = useState("");

  const [form, setForm] = useState({
    use_id: '',
    use_work_num: '',
    use_name: '',
    use_phone: '',
    sta_bank: '',
    sta_account: '',
    sta_type: '',
    sta_employ: '',
    sta_end: '',
  });

  //유저정보
  const getUser = async () => {
    const workNum = '1288663802'
    const result = await axios.get(`/staff/list.json?use_work_num=${workNum}`)
    setUserList(result.data);
    setForm(result.data);
    orgUserList = JSON.parse(JSON.stringify(result.data))
  }

  //search. 검색 기능
  const onSearch = e => {
    let keyword = document.getElementById('input-search').value
    if (e.key === 'Enter' || e.type == 'click') {
      let result = orgUserList.filter(el => el.use_name.includes(keyword))
      setUserList(keyword ? result : orgUserList)
    }
  };

  //근로형태 구분
  const staType = [
    { text: '전체', value: 'all' },
    { text: '정규직', value: 0 },
    { text: '계약직', value: 1 },
    { text: '일용직', value: 2 },
  ]


  //근로형태 필터
  let setFilter = (e) => {
    let selected = document.querySelector('.search-select').value;
    console.log(selected)
    let result = orgUserList.filter(el => el.sta_type == selected)
    setUserList(selected != 'all' ? result : orgUserList)
    setSelected(selected)
  }

  //set modal
  const [show, setShow] = useState(false);
  let [userInfo, setUserInfo] = useState({})

  const handleClose = () => setShow(false);
  let showModal = (info) => {
    setShow(true)
    setUserInfo(info)
  }


  let changeInfo = (key, value) => {
    let info = JSON.parse(JSON.stringify(userInfo))
    info[key] = value;
    setUserInfo(info)
  }

  //변경 된 값 수정
  const onSave = async () => {
    let response = await axios.post(`/staff/use_Update?use_id=${userInfo.use_id}`, userInfo)
    let response1 = await axios.post(`/staff/sta_Update?use_id=${userInfo.use_id}`, userInfo)
    console.log(response.data)
    console.log(response1.date);
    setShow(false);
    getUser()

  }

  //저장버튼을 누른경우
  const editUserInfo = async () => {
    try {
      console.log(userInfo)

      setBox({
        show: true,
        message: '정보를 수정하시겠습니까?',
        action: onSave
      })
    } catch (e) {
      console.log(e.response.data.msg)
    }
  }

  useEffect(() => {
    getUser();
  }, [])

  return (
    <div id="staff-list">
      <h1>직원목록</h1>
      <div className="search-wrap">
        <select onChange={setFilter} value={selected} className="search-select">

          {staType.map((type) => {
            return (
              <option value={type.value} key={type.value}>{type.text}</option>
            )
          })}

        </select>
        <div className="search-box">
          <input id="input-search" placeholder="직원검색" onKeyUp={onSearch} />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16" onClick={onSearch}>
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>계약시작일</th>
            <th>계약종료일</th>
            <th>근무형태</th>
            <th>은행이름</th>
            <th>계좌번호</th>
            <th>연락처</th>
            <th>직원주소</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {UserList.map((item) => {
            return (
              <tr key={item.use_id}>
                <td>🙍‍♂️{item.use_name}</td>
                <td>{item.start}</td>
                <td>{item.end}</td>
                <td>
                  {staType.filter(el => el.value === item.sta_type)[0].text}
                </td>
                <td>{item.sta_bank}</td>
                <td>{item.sta_account}</td>
                <td>{item.use_phone}</td>
                <td>{item.use_address}</td>
                <td>
                  <button className="btn-edit" onClick={() => showModal(item)}>✔️</button>

                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <Modal
        size="xl"
        show={show}
        onHide={handleClose}
        id="edit-modal"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>직원정보 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-content">
            <div className="input-form">
              <p>직원이름</p>
              <input type="text" value={userInfo.use_name} onChange={e => changeInfo('use_name', e.target.value)} />
            </div>
            <div className="input-form">
              <p>계약시작일</p>
              <input type="text" value={userInfo.start} onChange={e => changeInfo('start', e.target.value)} />
            </div>
            <div className="input-form">
              <p>계약종료일</p>
              <input type="text" value={userInfo.end} onChange={e => changeInfo('end', e.target.value)} />
            </div>
            <div className="input-form">
              <p>근무형태</p>
              <select value={userInfo.sta_type} onChange={(e) => changeInfo('sta_type', e.target.value)}>
                {staType.map((type) => {
                  return (
                    <option value={type.value} key={type.value}>{type.text}</option>
                  )
                })}
              </select>
            </div>
            <div className="input-form">
              <p>은행이름</p>
              <input type="text" value={userInfo.sta_bank} onChange={e => changeInfo('sta_bank', e.target.value)} />
            </div>
            <div className="input-form">
              <p>계좌번호</p>
              <input type="text" value={userInfo.sta_account} onChange={e => changeInfo('sta_account', e.target.value)} />
            </div>
            <div className="input-form">
              <p>연락처</p>
              <input type="text" value={userInfo.use_phone} onChange={e => changeInfo('use_phone', e.target.value)} />
            </div>
            <div className="input-form">
              <p>직원주소</p>
              <input type="text" value={userInfo.use_address} onChange={e => changeInfo('use_address', e.target.value)} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>취소</Button>
          <Button onClick={editUserInfo}>저장</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default MasterListPage