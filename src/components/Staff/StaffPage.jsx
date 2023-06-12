import axios from 'axios';
import React, { useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import {Row, Col} from 'react-bootstrap';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';


const StaffPage = () => {
 
     //사업장 정보 - use_id로 조회
     const [workplace, setWorkplace] = useState("");
 
     //onChage는 날짜 선택시 호출되는 콜백함수, value는 선택한 날짜 나타내는 상태변수
     const [value, onChange] = useState(new Date());
 
     //이벤트 정보
     const [event, setEvent] = useState([]); 
     const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
     const [form, setForm] = useState({
       use_id: sessionStorage.getItem("use_id"),
       use_work_num: sessionStorage.getItem("use_work_num"),
     });
     const {use_id, use_work_num} = form;
 
     //사업자번호 형식 지정
     const formattedNum = use_work_num.toString().replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3'); 
     
     //행사 리스트 출력
     const getEventList = async () => {
       const result = await axios.get(`/event/?event_start=${date}&use_work_num=${use_work_num}`);
       setEvent(result.data);
       console.log(date);
     };
 
     //사업장 정보 출력
     const getWorkPlace = async () =>{
       const result2 = await axios.get(`/workplace/about?use_work_num=${use_work_num}`);
       setWorkplace(result2.data);
     };
     
     //캘린터 날짜 변경
     const onDayChange = (e) =>{
       const formatDate = moment(e).format("YYYY-MM-DD");
       setDate(formatDate);
     };
 
   
   useEffect(() => {
     getEventList();
     getWorkPlace();
   }, [date]);

    return (
        <div className="back">
      <div className="back2"> 
      <Tabs defaultActiveKey="tab1" className="pt-3 ps-2">
          <Tab eventKey="tab1" title="매장정보" className="ps-3 pt-4">
            <Row>
                <Col md={5}>
                    <div className="text-start pb-4 px-5">
                        <h4 className="pt-3 pb-2"> 
                          매장명
                        </h4>
                        <p className="text-secondary fs-6">
                          {workplace.work_name}
                        </p>
                    </div>

                    <div className="text-start pb-2 px-5">
                        <h4 className="pb-2"> 
                          사업장주소
                        </h4>
                        <p className="text-secondary fs-6">
                          {workplace.work_address}
                        </p>
                    </div>
                </Col>

                <Col>
                    <div className="text-start pb-4 px-5">
                          <h4 className="pt-3 pb-2"> 
                            사업자번호
                          </h4>
                          <p className="text-secondary fs-6">
                            {formattedNum}
                          </p>
                    </div>
                </Col>
            </Row>

            <Row className="py-3">
                <Col md={5}>
                  <div className="text-start py-5 ps-5">
                    <div className='mb-3'>
                        <span className='py-2 me-4 pe-5 fs-3 event'>🎊 이달의 행사</span>    
                    </div>           
                      <Calendar
                        onChange={onDayChange}
                        value={value}
                        locale="en-EN"                                                             
                        />  
                  </div>               
                </Col>
                <Col md={4}>
                  <div className="text-start py-5 ps-5">
                      <h3 className='py-2 mb-3'>행사내용</h3>
                      <div>
                          {event.map(e=>(
                            <div key={e.use_id} style={{borderBottom:"solid 1px lightgray",padding:'5px'}}>
                              <span>▶︎ {e.start}~{e.end}&nbsp;|</span>
                              <span><b>&nbsp;&nbsp;{e.event_name}</b></span>
                            </div>
                          ))}
                      </div>
                  </div>           
                </Col>
            </Row>
          </Tab>
          <Tab eventKey="tab2" title="매장스케줄" className="my-4">
        //탭 안에 들어갈 내용
          </Tab>                  
      </Tabs>
          
      </div>
    </div>
    )
}

export default StaffPage