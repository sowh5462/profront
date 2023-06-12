import axios from 'axios';
import React, { useContext, useRef, useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row, Image, OverlayTrigger , Tooltip } from 'react-bootstrap'
import { AlertContext } from '../AlertContext';
import { withRouter } from 'react-router-dom/cjs/react-router-dom';
import logo from '../../images/로고.png';
import dayjs from 'dayjs';

const RegisterStaff = ({history}) => {
    const {setBox} = useContext(AlertContext);
    const [userImage, setUserImage] = useState('https://via.placeholder.com/100x100');
    const fileInput = useRef(null);
    const [form, setForm] = useState({
        use_id: sessionStorage.getItem("use_id"),
        sta_bank:'신한',
        sta_account:'',
        sta_type:'',
        sta_image:'',
        sta_employ: '',
        sta_end: '',
        sta_contract:'',
        file: null
    });
    const {use_id, sta_bank, sta_account, sta_type,
         sta_image, sta_contract, sta_employ, sta_end, file} = form;

    //직원타입 하나만 체크확인
    const checkOnlyOne = (checkThis) => {
        const checkboxes = document.getElementsByName('sta_type')
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i] !== checkThis) {
                checkboxes[i].checked = false
            }
        }
        setForm({   //직원 타입 분류
            ...form,
            'sta_type': checkThis.value
        })
    }


    //유저이미지 수정
    const selectedFile = (e) => {
        setUserImage(URL.createObjectURL(e.target.files[0]));
        setForm({...form, file:e.target.files[0]});
        // console.log(e.target.files[0].name);
    }

     //근로계약서
     const onChangeFile = (e) => {
        setForm({...form, sta_contract: e.target.files[0].name});
    }

    //폼 수정
    const onChange = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

   
    const onUpdate = async() => {
        const formData = new FormData();
        formData.append('use_id',use_id);
        formData.append('sta_bank', sta_bank);
        formData.append('sta_account', sta_account);
        formData.append('sta_image', sta_image);
        formData.append('sta_contract', sta_contract);
        formData.append('sta_employ', new Date(sta_employ))
        formData.append('sta_end', new Date(sta_end))
        formData.append('file', file);
        const config = {
            headers: {"content-type":"multipart/form-data"}
        }
        await axios.post('/user/sinsert', formData, config);
        history.push('/staff');
        console.log(form);
    }

    const onClickUpdate = () => {
        if(sta_account==="" || sta_type==="" || sta_employ===""){
            setBox({
                show: true,
                message: '정보를 빠짐없이 작성해 주세요!'
            });
            return;
        }else{
            if(sta_end===""){
                setForm({...form, sta_end: dayjs('2999-12-31').format("YYYY-MM-DD") });
            }else{
                setBox({
                    show: true,
                    message: '수정된 내용을 저장할까요?',
                    action: onUpdate
                });
            }
        }       
    }

    const handleImageClick = () => {
        fileInput.current.click();
    };
    
  return (
        <>
        <Row className="justify-content-center my-5">
      <Col lg={3} md={5} xs={8}>   
          <Row>             
            <Col>       
                <h3 className="py-3">
                <img src={logo} width='40px' alt="일해요로고"/>
                  <b>근로자 추가 정보입력</b>
                </h3>              
                  <Form className="text-start text-muted">
                    <div className="text-center">
                    <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="button-tooltip-2">이미지를 등록하려면 클릭하세요!</Tooltip>}
                    >
                    {({ ref, ...triggerHandler }) => (
                        <Button
                        variant="none"
                        {...triggerHandler}
                        className="d-inline-flex align-items-center"
                        >
                        <Image
                            ref={ref}
                            src={userImage}
                            style={{ borderRadius: "20%" }}
                            width="100px"
                            onClick={handleImageClick}
                        />
                        <Form.Control
                            type="file"
                            accept='image/*'
                            onChange={selectedFile}
                            ref={fileInput}
                            style={{ display: "none" }}
                        />
                        </Button>
                    )}
                    </OverlayTrigger>
                    </div>
                        <Form.Label className="mt-2">은행</Form.Label>
                        <InputGroup>
                            <select className="form-select" aria-label="Default select example" name="sta_bank" onChange={onChange} value={sta_bank}>                                   
                                <option value="신한">신한</option>
                                <option value="신협">신협</option>
                                <option value="국민">국민</option>
                                <option value="하나">하나</option>
                                <option value="우리">우리</option>
                                <option value="기업">기업</option>
                                <option value="한국">한국</option>
                                <option value="농협">농협</option>
                                <option value="씨티">씨티</option>
                                <option value="카카오뱅크">카카오뱅크</option>
                                <option value="새마을금고">새마을금고</option>
                                <option value="우체국">우체국</option>
                                <option value="SC제일">SC제일</option>
                            </select>
                        </InputGroup>
                        <Form.Label className="mt-2">계좌번호</Form.Label>
                        <InputGroup>
                        <Form.Control placeholder='"-" 를 포함해서 입력해 주세요' name='sta_account' value={sta_account} onChange={onChange} />     
                        </InputGroup>
                        <Form.Label className="mt-3 ">근로형태</Form.Label>
                        <InputGroup className='justify-content-center' onChange={onChange}>
                            <Form.Check className='px-3'>
                                <Form.Check.Input name='sta_type' value='0' onChange={(e) => checkOnlyOne(e.target)} />
                                <Form.Check.Label >정규직</Form.Check.Label>
                            </Form.Check>
                            <Form.Check className='px-3'>
                                <Form.Check.Input name='sta_type' value='1' onChange={(e) => checkOnlyOne(e.target)} />
                                <Form.Check.Label>계약직(아르바이트 포함)</Form.Check.Label>
                            </Form.Check>
                            <Form.Check className='px-3'>
                                <Form.Check.Input name='sta_type' value='2' onChange={(e) => checkOnlyOne(e.target)} />
                                <Form.Check.Label>일용직</Form.Check.Label>
                            </Form.Check>
                        </InputGroup>
                        <Form.Label className="mt-2">입사일</Form.Label>
                        <InputGroup>
                        <Form.Control type="date" name='sta_employ' value={sta_employ} onChange={onChange} />     
                        </InputGroup>
                        <Form.Label className="mt-2">퇴사 예정일</Form.Label>
                        <InputGroup>
                        <Form.Control  type="date" name='sta_end' value={sta_end} onChange={onChange} />     
                        </InputGroup>
                        <div style={{fontSize:"12px"}} className="pt-1">• 선택하지 않을 경우 무기한으로 설정됩니다</div>
                        <Form.Label className="mt-2">근로계약서</Form.Label>
                        <InputGroup>
                        <Form.Control  type="file" onChange={onChangeFile} />     
                        </InputGroup>                                       
                    </Form>      
                    <div  className='my-3'>
                    <Button onClick={onClickUpdate}> 저장</Button>                 
                    </div>
                </Col>
              </Row>           
            </Col>
        </Row>
</>
       
     
  )
}

export default withRouter(RegisterStaff)