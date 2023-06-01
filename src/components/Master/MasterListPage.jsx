import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'

import { AlertContext } from '../AlertContext';

let orgUserList = [];

const MasterListPage = () => {
  const {setBox} = useContext(AlertContext);
  const [UserList, setUserList] = useState([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState(0);

  const use_work_num = 1288663802;

  const getUser = async () => {
    const result = await axios.get(`/staff/list.json?use_work_num=${use_work_num}`)
    console.log(result.data);
    setUserList(result.data);
    orgUserList = JSON.parse(JSON.stringify(result.data))
    console.log(20, orgUserList)
  }

  useEffect(() => {
    getUser();
  }, [])

  const onSearch = e => {
    let keyword = document.getElementById('input-search').value
    if (e.key === 'Enter' || e.type == 'click') {
      let result = orgUserList.filter(el => el.use_name.includes(keyword))
      setUserList(keyword ? result : orgUserList)
    }
  };

  const onClickFilter = () => {
    setBox({
      show:true,message:<select value="근로형태">근로형태
        <option value='정규직'>정규직</option>
        <option value='계약직'>계약직</option>
        <option value='일용직'>일용직</option>
      </select>
      ,action:<Button></Button>
    })
    
  }

  return (
    <div>
      <h3>직원목록</h3>
      <Row className="my-5 justify-content-center">
        <Col md={10} className=''>
          <Button onClick={onClickFilter}>필터</Button>
          <input id="input-search" onKeyUp={onSearch} placeholder="검색어" />
          <Button onClick={onSearch}>Search</Button>
          <Button id="update">수정</Button>


          <Table striped bordered hover variant="dark" id="table">
            <thead>
              <tr>
                <td><input type="checkbox" className="px-3" />전체선택</td>
                <td>이름</td>
                <td>계약시작일</td>
                <td>계약종료일</td>
                <td>
               
                  근로형태
                    
                </td>
                <td>계좌번호</td>
                <td>연락처</td>
              </tr>
            </thead>
            <tbody>
              {UserList.map((m) => {
                return <tr key={m.use_id}>
                  <td><input type="checkbox" /></td>
                  <td name="use_name" value={query}>{m.use_name}</td>
                  <td>{m.sta_employ}</td>
                  <td>{m.sta_end}</td>
                  <td nmae='sta_type' value={type}>
                    {m.sta_type === 0 ? '정규직' : m.sta_type === 1 ? '계약직' : '일용직'}
                    <select>
                      <option value={m.sta_type}>정규직</option>
                      <option value={m.sta_type}>계약직</option>
                      <option value={m.sta_type}>일용직</option>
                    </select>
                    </td>
                  <td>{m.sta_bank}</td>
                  <td>{m.use_phone}</td>
                </tr>
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  )
}

export default MasterListPage