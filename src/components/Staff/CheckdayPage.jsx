import React,{ useState, useEffect , useContext} from 'react'
import { Col, Row, Button, Form, InputGroup} from "react-bootstrap";
import { AlertContext } from '../AlertContext';
import moment from 'moment';
import axios from 'axios';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';

const CheckdayPage = ({history}) => {
    const {setBox} = useContext(AlertContext);
    const [chk, setChk] = useState(''); //신청여부
    const [start, setStart] = useState('');
    const [form, setForm] = useState({
        use_id: sessionStorage.getItem("use_id"),
        chk_upday:"",
        chk_confirm: 1 ,
        chk_type:"",
        chk_time:"",
        chk_start:"",
        chk_end:"",
        use_work_num: sessionStorage.getItem("use_work_num")
    })
    
    const {use_id, chk_type, chk_time, chk_start, chk_end, chk_upday} = form;

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
                message:"유저 정보를 불러오는데 실패했습니다!"+err
            })
        }
     }

    //신청중인 결재내역 확인
    const onCheck = async() =>{
        const result = await axios.get(`/check/confirm?use_id=${use_id}`);
        setChk(result.data);
    }

    //근무일 변경
    const onChangeDay = (e) =>{
        setForm({
          ...form,
          chk_upday:e.target.value
        });
    }

    //시작시간 변경
    const onChangeSta = (e) =>{
        if(chk_upday===""){
            setBox({
                show:true,
                message:"근무일을 먼저 선택해 주세요!"
            })
        }else{
            const startTime = moment(e.target.value, "HH:mm:ss");
            const statime = moment(chk_upday).set({ hour: startTime.hours(), minute: startTime.minutes(),second: startTime.seconds()});
            const chk_statime = statime.format("YYYY-MM-DD HH:mm:ss")
            setForm({
                ...form,
                chk_start: new Date(chk_statime)
            });
            setStart(startTime);
        }      
    }

    //종료시간 변경
    const onChangeEnd = (e) =>{
        if(chk_upday===""){
            setBox({
                show:true,
                message:"근무일을 먼저 선택해 주세요!"
            })
        }else if(chk_start===""){
            setBox({
                show:true,
                message:"시작시간을 먼저 선택해 주세요!"
            })
        }else{
            const endTime = moment(e.target.value, "HH:mm:ss"); //시간포맷
            const endtime = moment(chk_upday).set({ hour: endTime.hours(), 
            minute: endTime.minutes(),second: endTime.seconds()}); // 근무일+시간
            const chk_endtime = endtime.format("YYYY-MM-DD HH:mm:ss"); //날짜 형식으로 변환

            const duration = moment.duration(endTime.diff(start)); //종료시간 - 시작시간
            const hours = Math.round(duration.asHours()); //반올림
            setForm({
                ...form,
                chk_end: new Date(chk_endtime), //데이터 타입 날짜
                chk_time: parseInt(hours)
            });
        }       
    }
    
    //체크박스 - 하나만 선택
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const handleCheckboxChange = (e) => {
        setSelectedCheckbox(e.target.value);
        setForm({
            ...form, chk_type:e.target.value
        })
    };

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
                message:"결재 신청오류"+err
            })
        }
    }

    //결재 신청하기
    const onInsertCheck = async() =>{
     
        if(chk > 0){
            setBox({
                show:true,
                message:"신청 중인 결재 내역이 존재합니다."
            })
            return;
        }else if(chk_type===""){
            setBox({
                show:true,
                message:"신청서 구분을 선택해 주세요"
            })
            return;
        }else if(chk_start==="" || chk_end === "" || chk_upday === ""){
            setBox({
                show:true,
                message:"항목을 빠짐없이 작성해 주세요!"
            })
            return;
        }else if(chk_start >= chk_end){
            setBox({
                show:true,
                message:"종료시간은 시작시간 이후로 선택해 주세요!"
            })
            return;
        }else{ 
            setBox({
            show: true,
            message:`${chk_type} ${chk_time}시간에 대한 결재를 신청하시겠습니까?` ,
            action: onInsert
            });                  
        }
    }

    useEffect(()=>{
        getUser();
        onCheck();
    },[])

    
  return (
    <div>
        <Row>
            <Col>
            <Form className="text-start">
            <Form.Group as={Form.Row}>
                <Form.Label as={Col} sm={2}>
                <h4 className="mb-4 ps-2" style={{borderLeft:"solid 5px gray"}}>신청서구분</h4>
                </Form.Label>
                <Col sm={10}>
                    <Form.Check
                        inline
                        type="checkbox"
                        id="option1"
                        label="연장"
                        value="연장"
                        checked={selectedCheckbox === '연장'}
                        onChange={handleCheckboxChange}
                    />
                    <Form.Check
                        inline
                        type="checkbox"
                        id="option2"
                        label="조퇴"
                        value="조퇴"
                        checked={selectedCheckbox === '조퇴'}
                        onChange={handleCheckboxChange}
                    />

                    <Form.Check
                        inline
                        type="checkbox"
                        id="option3"
                        label="대체"
                        value="대체"
                        checked={selectedCheckbox === '대체'}
                        onChange={handleCheckboxChange}
                    />
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
                    <div className="mt-2">
                        {user.use_type===0 ? '계약직' : user.use_type===1 ?"정규직" :"일용직"}
                    </div>
                </div>
            </Col>                       
        </Row>
        <Row>
            <Col md={6}>
            <Form className="my-3">
            <h4 className="text-start mb-4">📝 신청서작성</h4>  
            <Form.Group as={Row} className="mb-2">
                <Col sm="5">
                    <InputGroup className="mb-2">
                        <InputGroup.Text>근무일</InputGroup.Text>
                        <Form.Control name="chk_upday" onChange={onChangeDay}  type="date"/>
                    </InputGroup>    
                </Col>
            </Form.Group>    
                   
            <Form.Group as={Row} className="mb-2">
                <Col sm="7">
                    <InputGroup className="mb-2">
                        <InputGroup.Text>시작시간</InputGroup.Text>
                        <Form.Control name="chk_start" onChange={onChangeSta} type="time"/>
                    </InputGroup>    
                </Col>
            </Form.Group> 
            <Form.Group as={Row} className="mb-2">
                <Col sm="7">
                    <InputGroup className="mb-2">
                        <InputGroup.Text>종료시간</InputGroup.Text>
                        <Form.Control name="chk_end"  onChange={onChangeEnd} type="time"/>
                    </InputGroup>    
                    <Button className="px-4 my-4" style={{fontWeight:"500"}} onClick={onInsertCheck}>신청</Button>
                </Col>
            </Form.Group> 
            </Form>             
            </Col>
        </Row>
    </div>
  )
}

export default withRouter(CheckdayPage)