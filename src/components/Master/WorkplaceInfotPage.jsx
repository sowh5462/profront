import axios from 'axios';
import React, { useEffect, useState, useContext} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { Container } from 'react-bootstrap';
import {Row, Col, Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import { AlertContext } from '../AlertContext';
import {FaRegTrashAlt} from "react-icons/fa";
import {BsPlusCircleFill} from "react-icons/bs";

const WorkplaceInfotPage = () => {

    //폼모달창
    const [show, setShow] = useState(false);
    const modalClose = () => setShow(false);
    const modalShow = () => setShow(true);
    //알림모달
    const {setBox} = useContext(AlertContext);

    //이벤트 정보
    const [event, setEvent] = useState([]); 
    const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
    const [form, setForm] = useState({
      use_id:2,
      use_work_num:1288663802,
      event_name:"",
      event_start:"",
      event_end:""
  });
    const {use_id, use_work_num, event_name, event_start, event_end} = form;

    //사업자번호 형식 지정
    const formattedNum = use_work_num.toString().replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');

    //사업장 정보 - use_id로 조회
    const [workplace, setWorkplace] = useState("");
 
    //onChage는 날짜 선택시 호출되는 콜백함수, value는 선택한 날짜 나타내는 상태변수
    const [value, onChange] = useState(new Date());
    
    //행사 리스트 출력
    const getEventList = async () => {
    const result = await axios.get(`/event/?event_start=${date}`);
      setEvent(result.data);
      console.log(date);
    };

    //사업장 정보 출력
    const getWorkPlace = async () =>{
      const result2 = await axios.get(`/workplace/?use_id=${use_id}`);
      setWorkplace(result2.data);
    }

    const formatPhoneNumber = (number) => {
      const formattedNumber = number.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
      return formattedNumber;
    }
    

   //캘린터 날짜 변경
   const onDayChange = (e) =>{
    const formatDate = moment(e).format("YYYY-MM-DD");
    setDate(formatDate);
  }

  //+버튼(행사추가) 모달창 오픈
    const onClickInsert = () =>{
    modalShow();
  }

  //폼내용 변경함수
  const onFormChange = (e) =>{
    setForm({
        ...form,
        [e.target.name]:e.target.value
    })
  }

  //행사등록 - 유효성검사
  const onSubmit = async() =>{

    //날짜 형식 체크
    const isValidDate = (formatDate) => {
      const pattern = /^\d{4}-\d{2}-\d{2}$/;
      return pattern.test(formatDate);
    };
    if(event_name==="" || event_start==="" || event_end===""){
      setBox({
        show:true,
        message:"작성하지 않은 부분이 존재합니다!"
      }) 
    }else if(!isValidDate(event_start) || !isValidDate(event_end)){
      setBox({
        show:true,
        message:"날짜 형식이 틀립니다. 다시 작성해주세요!"
      })
    }else if(event_start < moment(new Date()).format("YYYY-MM-DD") || 
            event_end <= moment(new Date()).format("YYYY-MM-DD")){
        setBox({
          show:true,
          message:"오늘 이후의 날짜만 등록이 가능합니다."
        }) 
    }else if(event_end < event_start){
        setBox({
          show:true,
          message:"종료일은 시작일 이후로 작성해주세요!"
        })
    }else{
        await axios.post("/event/insert",form);
        setForm({
            ...form,
            event_name:"",
            event_start:"",
            event_end:""
        })
        modalClose();
        getEventList();
    }   
  }

  //행사삭제버튼
  const onDelete = (event_id) =>{
    setBox({
      show:true,
      message:"해당 이벤트를 삭제하시겠습니까?",
      action: async()=>{
        await axios.get("/event/delete?event_id="+event_id);
        getEventList();
        setDate(moment(new Date()).format("YYYY-MM-DD"));
      }
    })   
  }
  
  useEffect(() => {
    getEventList();
    getWorkPlace();
  }, [date]);

  return (
    <div className="back">
      <div className="back2"> 
        <Row>
            <Col md={3}>
              <div className="text-start py-4 px-5">
                  <h4 className="pt-5 pb-2"> 
                    매장명
                  </h4>
                  <p className="text-secondary fs-6">
                    {workplace.work_name}
                  </p>
              </div>

              <div className="text-start py-2 px-5">
                  <h4 className="pb-2"> 
                    사업장주소
                  </h4>
                  <p className="text-secondary fs-6">
                    {workplace.work_address}
                  </p>
              </div>
            </Col>

            <Col>
              <div className="text-start py-4 px-5">
                    <h4 className="pt-5 pb-2"> 
                      사업자번호
                    </h4>
                    <p className="text-secondary fs-6">
                      {formattedNum}
                    </p>
              </div>
            </Col>
          </Row>

          <Row className="py-3">
              <Col md={3}>
                <div className="text-start py-5 px-5">
                    <div>
                      <h3 className='py-2'>🎊 이달의 행사  
                        <span className="text-info fs-4" style={{float:'right', cursor:"pointer"}} onClick={onClickInsert}>
                          <BsPlusCircleFill/>
                        </span>
                      </h3>                
                    </div>
                    <Calendar
                      onChange={onDayChange}
                      value={value}
                      locale="en-EN"                                                              
                      />  
                </div>               
              </Col>
              <Col md={4}>
                <div className="text-start py-5 px-5">
                    <h3 className='py-2'>행사내용</h3>
                    <div>
                        {event.map(e=>(
                          <div style={{borderBottom:"solid 1px lightgray",padding:'5px'}}>
                            <span>▶︎ {e.start}~{e.end}&nbsp; |  </span>
                            <span><b>&nbsp;&nbsp;{e.event_name}</b></span>
                            <span className="ps-4" style={{float:'right',cursor:"pointer"}} onClick={()=>onDelete(e.event_id)}><FaRegTrashAlt/></span>
                          </div>
                        ))}
                    </div>
                </div>           
              </Col>
          </Row>
      </div>
       
        
        
        <Modal
        show={show}
        onHide={modalClose}
        backdrop="static"
        keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>행사등록</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form> 
                  <input type="hidden" value={use_id} name="use_id"/>
                  <input type="hidden" value={use_work_num} name="use_work_num"/>
                  <InputGroup className="mb-2">
                      <InputGroup.Text>행사 내용</InputGroup.Text>
                      <Form.Control value={event_name} name="event_name" onChange={onFormChange}/>
                  </InputGroup>
                  <InputGroup className="mb-2">
                      <InputGroup.Text>행사시작일</InputGroup.Text>
                      <Form.Control value={event_start} name="event_start" onChange={onFormChange} placeholder="ex) yyyy-mm-dd"/>
                  </InputGroup>
                  <InputGroup>
                      <InputGroup.Text>행사종료일</InputGroup.Text>
                      <Form.Control value={event_end} name="event_end" onChange={onFormChange} placeholder="ex) yyyy-mm-dd"/>
                  </InputGroup>
              </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={modalClose}>
              닫기
            </Button>
            <Button variant="primary" onClick={onSubmit}>등록</Button>
          </Modal.Footer>
      </Modal>
    </div>
  )

};

export default WorkplaceInfotPage;
