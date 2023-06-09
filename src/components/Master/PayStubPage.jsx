import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { Button, Col, Form, InputGroup, Row, Spinner, Table } from 'react-bootstrap'
import html2canvas from 'html2canvas';
import { firebase } from '../../Firebase'
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage'
import { useContext } from 'react';
import { AlertContext } from '../AlertContext';

const PayStubPage = () => {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [staff, setStaff] = useState({
    sta_bank: "",
    sta_account: "",
    sta_type: 0,
    pay_regular: 0,
    pay_hour: 0,
    use_id: 0
  });
  const [name, setName] = useState("");
  const [stub, setStub] = useState([]);
  const [more, setMore] = useState(0);
  const [pay_regular, setPay_regular] = useState(0);
  const [work_time, setWork_time] = useState(0);
  const { setBox } = useContext(AlertContext);
  const [pay_all, setPay_all] = useState(0);
  const { sta_bank, sta_account, sta_type } = staff;

  const pay_more = 9620 * more * 1.5; //연장수당
  const pay_night = 0;
  const pay_holiday = 0;
  const pay_meal = 10000; //식대
  

  let tax;
  let ens1;
  let ens2;
  let ens3;
  let ens4;
  let union;

  if (sta_type === 2) {
    tax = 0;
    ens1 = 0;
    ens2 = 0;
    ens3 = 0;
    ens4 = 0;
    union = 0;
  } else {
    tax = 115530;
    ens1 = Math.round((pay_regular * 0.045) / 10) * 10; //국민연금
    ens2 = Math.round((pay_regular * 0.009) / 10) * 10; //고용보험
    ens3 = Math.round((pay_regular * 0.03545) / 10) * 10; //건강보험
    ens4 = Math.round((ens3 * 0.1281) / 10) * 10; //장기요양보험
    union = 10000;
  }

  const pay_not = tax + ens1 + ens2 + ens3 + ens4 + union;

  let today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
  let time = {
    year: today.getFullYear(),  //현재 년도
    month: (today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1), // 현재 월
    date: today.getDate() > 9 ? today.getDate() : '0' + today.getDate() // 현재 날짜
  };

  //급여명세서에 들어갈 현재 날짜
  let timestring = `${time.year}-${time.month}-${time.date}`;

  let year_month = `${time.year}-${time.month}`;

  //select박스에 들어갈 직원리스트
  const getStaffList = async () => {
    const use_work_num = sessionStorage.getItem("use_work_num");
    const res = await axios.get(`/staff/list.json?use_work_num=${use_work_num}`);
    //console.log(res.data);
    setStaffList(res.data);
  };

  //select박스에서 직원 이름 선택시
  const onChangeName = async (e) => {
    setPay_regular(0);
    const staffName = e.target.value;
    setName(staffName)
    const use_work_num = sessionStorage.getItem("use_work_num");
    setLoading(true);

    //명세서 리스트
    const res = await axios.get(`/payroll/stubList.json?use_work_num=${use_work_num}&stub_name=${staffName}`);
    setStub(res.data);

    //직원 정보 (은행, 계좌번호)
    const res2 = await axios.get(`/payroll/staff?use_work_num=${use_work_num}&use_name=${staffName}`);
    setStaff(res2.data);

    //연장근무 시간
    const res3 = await axios.get(`/payroll/more?use_work_num=${use_work_num}&use_name=${staffName}`);
    setMore(res3.data);

    //현재까지 급여
    const res4 = await axios.get(`/payroll/untill?use_id=${res2.data.use_id}&date=${timestring}`);
    setWork_time(res4.data);

    setLoading(false);
  };

  useEffect(() => {
    getStaffList();
  }, []);

  const onClickDownload = () => {
    if (pay_regular === 0 || Number.isNaN(pay_regular)) {
      setBox({ show: true, message: '급여를 계산해주세요' });
      return;
    } else if (name === "") {
      setBox({ show: true, message: '직원을 선택해주세요' });
      return;
    }
    const bill = document.getElementById('bill');
    html2canvas(bill, { letterRendering: 1 }).then(canvas => {
      const image = canvas.toDataURL();
      const storage = getStorage();
      const stubName = `Bills/${year_month} ${name}.jpg`;
      const storageRef = ref(storage, stubName);
      uploadString(storageRef, image, 'data_url').then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          const use_id = staff.use_id;
          const use_work_num = sessionStorage.getItem("use_work_num");
          const stub_name = year_month + " " + name + ".jpg";
          const stub_url = url;
          axios.post(`/payroll/stub/insert`,
            { "use_id": use_id, "use_work_num": use_work_num, "stub_name": stub_name, "stub_url": stub_url });
          axios.post('/payroll/pay/insert', { "use_id": use_id, "pay_regular": pay_regular, "pay_name": stub_name })
        })
      })
    })
    setBox({ show: true, message: '성공적으로 저장되었습니다.' });
  };

  const handleButtonClick = async (url) => {
    window.open(url, '_blank');
  };

  const onClickCalc = async() => {
    const regular = document.getElementById('regular');
    setPay_regular(parseInt(regular.value));
    setPay_all(parseInt(pay_regular) + parseInt(pay_more) + parseInt(pay_meal) + parseInt(pay_night) + parseInt(pay_holiday))
  };

  const onClickDelete = (stub_name, stub_id) => {
    const storage = getStorage();
    const deleteRef = ref(storage, `Bills/${stub_name}`);

    deleteObject(deleteRef).then(() => {
      // File deleted successfully
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });

    axios.get(`/payroll/stub/delete?stub_id=${stub_id}`);
    axios.get(`/payroll/pay/delete?pay_name=${stub_name}`);
    setBox({show: true, message: '삭제되었습니다.'});
  };


  if (loading) return <Spinner animation='border' className='position-absolute top-50 start-50' />
  return (
    <Row className="py-4">
      <Col md={3}>
        <select id='sta_name' style={{ width: "200px", fontSize: "20px", textAlign: "center" }} onChange={onChangeName} value={name}>
          <option>-----</option>
          {staffList.map(s =>
            <option key={s.use_id} value={s.use_name}>{s.use_name}</option>
          )}
        </select>

        {stub.map(s =>
          <div key={s.stub_id} className='border border-4 rounded-4 py-2 my-2'>
            <span onClick={() => handleButtonClick(s.stub_url)} style={{ cursor: "pointer" }}>{s.stub_name}</span>
            <Button className='btn-sm ms-3' onClick={()=>onClickDelete(s.stub_name, s.stub_id)}>삭제</Button>  
          </div>
        )}

      </Col>
      <Col md={7} className='border border-4 py-3' id='bill'>
        <h3 className="py-3">급여명세서</h3>
        <div className='my-2'>
          <div className='text-end pe-2'>지급일:{timestring}</div>
          <InputGroup className='w-25' data-html2canvas-ignore="true">
            <Form.Control type='number' className='text-end' id='regular' placeholder={`${(work_time * 9620).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} onChange={(e)=>setPay_regular(e.target.value)} />
            <Button onClick={onClickCalc}>계산</Button>
          </InputGroup>
        </div>
        <Table className='mb-3' style={{ fontSize: "12px" }}>
          <tbody>
            <tr>
              <td rowSpan={2} className='align-middle border border-1'>성명</td>
              <td rowSpan={2} className='align-middle border border-1'>{name}</td>
              <td className='border border-1'>은행</td>
              <td className='border border-1'>{sta_bank}</td>
            </tr>
            <tr>
              <td className='border border-1'>계좌번호</td>
              <td width={"250px"} className='border border-1'>{sta_account}</td>
            </tr>
          </tbody>
        </Table>
        <Table className='mb-3 border border-1' style={{ fontSize: "12px" }}>
          <thead className='bg-light'>
            <tr>
              <td colSpan={5}>세부내역</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className='border-end border-1'>지급</td>
              <td colSpan={2}>공제</td>
            </tr>
            <tr className='border border-1'>
              <td colSpan={3} className='border-end border-1'>입금 항목</td>

              <td>공제 항목</td>
              <td>공제 금액(원)</td>
            </tr>
            <tr>
              <td rowSpan={6} className='align-middle border-end border-start border-1'>매월지급</td>
              <td>기본급</td>

              {sta_type === 2 ?
                <td className='border-end border-1'>
                  0
                </td>
                :
                <td className='border-end border-1'>
                  {pay_regular.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </td>
              }

              <td>소득세</td>
              <td>{tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
            <tr>
              <td>연장근로수당</td>
              {more === 0 ?
                <td className='border-end border-1'>{more}</td>
                :
                <td className='border-end border-1'>{pay_more.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              }
              <td>국민연금</td>
              <td>{ens1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
            <tr>
              <td>야간근로수당</td>
              <td className='border-end border-1'>{pay_night.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              <td>고용보험</td>
              <td>{ens2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
            <tr>
              <td>휴일근로수당</td>
              <td className='border-end border-1'>{pay_holiday.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              <td>건강보험</td>
              <td>{ens3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
            <tr>
              <td>가족수당</td>
              <td className='border-end border-1'>0</td>
              <td>장기요양보험</td>
              <td>{ens4.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
            <tr>
              <td>식대</td>
              <td className='border-end border-1'>{pay_meal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              <td>노동조합비</td>
              <td>{union.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
            <tr>
              <td width={"86px"} className='border-start border-end border-1'><span>격월<br />또는<br />부정기 지급</span></td>
              {sta_type === 2 ? <td colSpan={4} className='align-middle'>{pay_regular.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td> : <td colSpan={4}></td>}
            </tr>
            <tr className='border-top border-1'>
              <td colSpan={2}>지급액 계</td>
              <td className='border-end border-1'>{pay_all.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              <td>공제액 계</td>
              <td>{pay_not.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
            <tr>
              <td colSpan={3}></td>
              <td>실수령액</td>
              <td>{(pay_all - pay_not).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
          </tbody>
        </Table>
        <Table style={{ fontSize: "12px" }}>
          <thead className='bg-light'>
            <tr>
              <td colSpan={3}>계산방법</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td width={"150px"}>구분</td>
              <td>산출식 또는 산출방법</td>
              <td width={"150px"}>지급액(원)</td>
            </tr>
            <tr>
              <td>연장근로수당</td>
              <td>시급 X 연장근무시간 X 1.5</td>
              <td>{pay_more.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
            <tr>
              <td>야간근로수당</td>
              <td>시급 X 야간근무시간 X 1.5</td>
              <td>{pay_night.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
            <tr>
              <td>휴일근로수당</td>
              <td>시급 X 휴일근무시간 X 1.5</td>
              <td>{pay_holiday.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
          </tbody>
        </Table>
        <Button onClick={onClickDownload} className='mt-5 px-5' data-html2canvas-ignore='true'>저장</Button>
      </Col>
    </Row>
  )
}

export default PayStubPage