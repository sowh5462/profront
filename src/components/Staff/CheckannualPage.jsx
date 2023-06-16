import axios from 'axios';
import React, { useEffect, useState, useContext} from 'react';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import {Row, Col, Form} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { AlertContext } from '../AlertContext';

const CheckannualPage = () => {
    const {setBox} = useContext(AlertContext);
    const [chk, setChk] = useState(''); //신청여부
    const [start, setStart] = useState(''); //시작일
    const [time, setTime] = useState(''); //신청일수
    const [annual, setAnnual] = useState('');

    const [form, setForm] = useState({
        use_id: sessionStorage.getItem("use_id"),
        chk_confirm: 1 ,
        chk_type:"연차",
        chk_time:"",
        chk_start:"",
        chk_end:"",
        use_work_num: sessionStorage.getItem("use_work_num")
    })

    const {use_id, chk_type, chk_time, chk_start, chk_end} = form;

    //유저정보
    const [user,setUser] = useState("");
    const id = sessionStorage.getItem("use_login_id")
    const getUser = async() =>{
        try{
            const result = await axios.get(`/user/uread?use_login_id=${id}`);
            setUser(result.data);
        }catch(err){
            setBox({
                show:true,
                message:"유저 정보를 가져오는 중 오류가 발생했습니다"+err
            })
        }      
    }

    //연차개수
    const getAnnual = async() =>{
        const result = await axios.get(`/staff/annual?use_id=${use_id}`);
        setAnnual(result.data);
    }

    //신청중인 결재내역 확인
    const onCheck = async() =>{
        const result = await axios.get(`/check/confirm?use_id=${use_id}`);
        setChk(result.data);
    }

    //시작일 변경
    const onChangeSta = (e) =>{    
        const startTime = moment(e.target.value, "YYYY-MM-DD HH:mm:ss");
        setForm({
            ...form,
            chk_start: new Date(startTime)
        });
        setStart(startTime); 
    }

    //종료일 변경
    const onChangeEnd = (e) =>{
      if(chk_start===""){
            setBox({
                show:true,
                message:"시작시간을 먼저 선택해 주세요!"
            })
        }else{
            const endTime = moment(e.target.value, "YYYY-MM-DD HH:mm:ss"); //시간포맷
            const duration = moment.duration(endTime.diff(start)).asDays() //종료시간 - 시작시간
            setForm({
                ...form,
                chk_end: new Date(endTime),//데이터 타입 날짜
                chk_time: parseInt(duration+1)
            });
            setTime(duration+1);
        }       
    }

    //결재신청
    const onInsert = async() =>{   
       try{
            await axios.post(`/check/insert`,form);
            setBox({
                show:true,
                message:"결재가 성공적으로 신청되었습니다."
            })
       }catch(err){
        setBox({
            show:true,
            message:"결재 신청 오류"+err
        })
       }
    }

     //신청버튼
    const onInsertCheck = async() =>{
        if(chk > 0){
            setBox({
                show:true,
                message:"신청 중인 결재 내역이 존재합니다."
            })
            return;
        }else if(chk_start==="" || chk_end === ""){
            setBox({
                show:true,
                message:"항목을 빠짐없이 작성해 주세요!"
            })
            return;
        }else if(chk_start > chk_end){
            setBox({
                show:true,
                message:"종료일은 시작일 이후로 선택해 주세요!"
            })
            return;
        }else if(chk_time > annual){
            setBox({
                show:true,
                message:"잔여 연차보다 신청일 수가 더 큽니다!"
            })
            return;       
        }else{ 
            setBox({
            show: true,
            message:`연차 ${chk_time}일에 대한 결재를 신청하시겠습니까?` ,
            action: onInsert
            });                  
        }
    }
 

    useEffect(()=>{
        getUser();
        onCheck();
        getAnnual();
    },[time])

    return (
        <div style={{paddingBottom:"500px"}}>
        <Row>
            <Col>
            <Form className="text-start">
            <Form.Group as={Form.Row}>
                <Form.Label as={Col} sm={2}>
                <h4 className="mb-3 ps-2" style={{borderLeft:"solid 5px gray"}}>연차신청</h4>
                </Form.Label>
                <Col sm={10}>
                </Col>
                </Form.Group>
                </Form>

                </Col>
        </Row>
        <Row className="text-start my-3">
            <Col md={5}>
                <div className="mb-3">
                <b>신청자</b> {user.use_name}
                </div>
                <hr/>
                <div>
                    <b>근로계약형태</b> 
                    <br/>
                    <div className="mt-2 mb-3">
                        {user.use_type===0 ? '계약직' : user.use_type===1 ?"정규직" :"일용직"}
                    </div>
                </div>
                <hr/>
                <div>
                    <b>잔여연차</b> 
                    <br/>
                    <div className="mt-2">
                        {annual}개
                    </div>
                </div>
            </Col>                       
        </Row>
        <Row>
            <Col md={6}>
                <Form className="my-3">
                <h4 className="text-start mb-4">📝 신청서작성</h4>    
                <Form.Group as={Row} className="mb-2">
                    <Col sm="3">
                    <Form.Control name="chk_time" value={time} readOnly placeholder="신청일수" />
                    </Col>
                </Form.Group>           
                <Form.Group as={Row} className="mb-2">
                    <Col sm="7">
                        <InputGroup className="mb-2">
                            <InputGroup.Text>시작일</InputGroup.Text>
                            <Form.Control onChange={onChangeSta} name="chk_start" type="date"/>
                        </InputGroup>    
                    </Col>
                </Form.Group>    
                <Form.Group as={Row} className="mb-2">
                    <Col sm="7">
                        <InputGroup className="mb-2">
                            <InputGroup.Text>종료일</InputGroup.Text>
                            <Form.Control onChange={onChangeEnd} name="chk_end" type="date"/>
                        </InputGroup>    
                        <Button className="px-4 my-3" onClick={onInsertCheck} style={{fontWeight:"500"}}>신청</Button>
                    </Col>
                </Form.Group>    
            
                </Form>
               
            </Col>
        </Row>
    </div>
  )
}

export default CheckannualPage