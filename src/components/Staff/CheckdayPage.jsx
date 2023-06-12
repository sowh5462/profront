import React,{ useState, useEffect , useContext} from 'react'
import { Col, Row, Button, Form, InputGroup} from "react-bootstrap";
import { AlertContext } from '../AlertContext';
import moment from 'moment';
import axios from 'axios';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';

const CheckdayPage = ({history}) => {
    const {setBox} = useContext(AlertContext);
    const [chk, setChk] = useState(''); //신청여부
    const [day, setDay] = useState(''); //근무일
    const [sta, setSta] = useState('');
    const [end, setEnd] = useState('');

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
         const result = await axios.get(`/user/uread?use_login_id=${id}`);
         setUser(result.data);
     }

    //신청중인 결재내역 확인
    const onCheck = async() =>{
        const result = await axios.get(`/check/confirm?use_id=${use_id}`);
        setChk(result.data);
    }

    //폼 변경 - 시작
    const onChangeSta = (e) =>{
        setForm({
          ...form, chk_start: e.target.value
        });
        setSta(moment(chk_start, "HH:mm"));
    }

    //폼 변경 - 종료
    const onChangeEnd = (e) =>{
        setForm({
            ...form, chk_end: e.target.value
        })
        setEnd(moment(chk_end, "HH:mm"))
    }

    //폼 변경 - 날짜
    const onChangeDay = (e) =>{
        setForm({
            ...form, chk_upday: e.target.value
        })
        setDay(chk_upday);
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
        console.log(form);
        // await axios.post(`/check/insert`,form);
        // history.push("/staff");
    }

    //결재 신청하기
    const onInsertCheck = async() =>{
        if(chk > 0){
            setBox({
                show:true,
                message:"신청중인 결재내역이 존재합니다."
            })
            return;
        }else if(chk_type==="" || chk_start==="" || chk_end === ""){
            setBox({
                show:true,
                message:"항목을 빠짐없이 작성해주세요!"
            })
            return;
        }else{     
            console.log(day);    
            console.log(sta);      
            console.log(end);    
            // const duration = moment.duration(end.diff(sta));
            // const hours = Math.round(duration.asHours());

            // setForm({
            // ...form,
            // chk_time: hours,
            // chk_start: moment(`${chk_upday} ${chk_start}`).format("YYYY-MM-DD HH:mm"),
            // chk_end: moment(`${chk_upday} ${chk_end}`).format("YYYY-MM-DD HH:mm"),
            // });

          
            // setBox({
            // show: true,
            // message: "결재를 올리시겠습니까?",
            // action: onInsert,
            // });
        }
    }
   
  

    useEffect(()=>{
        getUser();
        onCheck();
    },[form])

  return (
    <>
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
    </>
  )
}

export default withRouter(CheckdayPage)