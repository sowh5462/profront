import React from 'react'
import { useContext, useState } from 'react'
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { AlertContext } from '../AlertContext'
import axios from 'axios'

const RegisterStaffPage2 = ({ history }) => {
    const { setBox } = useContext(AlertContext);
    const [userImage, setUserImage] = useState('');
    const [fileName, setFileName] = useState('');
    //회원폼 - default(직원)
    const [form, setForm] = useState({
        use_id: sessionStorage.getItem("use_id"),
        use_work_num: sessionStorage.getItem("use_work_num"),
        sta_type: '',
        sta_bank: '',
        sta_image:'',
        sta_account: '',
        sta_employ: '',
        sta_end: '',
        sta_contract: '',
        file: null
    });

    const { use_id, sta_type, sta_bank, sta_image, sta_account, sta_employ, sta_end, sta_contract, file } = form;

    //폼내용 변경
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

    }

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

    const onInsert = async () => {
        try{
            const formData = new FormData();
            formData.append('use_id', use_id);
            formData.append('sta_bank', sta_bank);
            formData.append('sta_image', sta_image);
            formData.append('sta_account', sta_account);
            formData.append('sta_type', sta_type);
            formData.append('sta_employ', sta_employ);
            formData.append('sta_end', sta_end);
            formData.append('sta_contract', sta_contract);
            formData.append('file', file);
            const config = {
                headers: { "content-type": "multipart/form-data" }
            }
            await axios.post('/user/register/staff', formData, config);
            history.push("/");
        }catch(err){
            setBox({
                show:true,
                message:"회원가입에 실패했습니다!"+err
            })
        }       
    }

    //등록버튼
    const onRegister = () => {
        if (sta_bank === "" || sta_account === "" || sta_employ === "" || sta_type === "") {
            setBox({
                show: true,
                message: "정보를 빠짐없이 작성해주세요"
            })
        } else {
            setBox({
                show: true,
                message: "정보를 등록하시겠습니까?",
                action: onInsert
            })
        }
    }

    //이미지 변경
    const onChangeFile = (e) => {
        setFileName(URL.createObjectURL(e.target.files[0]));
        setForm({ ...form, file: e.target.files[0] });
    }

    const selectFile = (e) => {
        setUserImage(URL.createObjectURL(e.target.files[0]));
        setForm({...form, sta_image:e.target.files[0]});
        // console.log(e.target.files[0].name);
    }

    return (
        <>
            <div>
                <Row className='my-5 justify-content-center'>
                    <Col md={5} className=''>
                        <h1 className='text-center mb-5'>직원 회원가입</h1>
                        <Form>
                            <Row>
                                <Col>
                                    <div className="my-5">
                                        <h4>사진</h4>
                                            <img src={userImage} width="20%"/>
                                            <Form.Control type='file'
                                            onChange={selectFile}
                                        />
                                    </div>
                                    <select className="form-select" defaultValue={'신한'} aria-label="Default select example" name="sta_bank" onChange={onChange} value={sta_bank}>
                                    
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
                                    <InputGroup className='my-2'>
                                        <Form.Control placeholder='계좌번호 "-" 포함하여 입력해주세요' className=' square border border-3 py-1'
                                            name="sta_account" value={sta_account}
                                            onChange={onChange} />
                                    </InputGroup>

                                    <div className='my-3'>
                                        <h4>근로형태</h4>
                                        <InputGroup className='' onChange={onChange}>
                                            <Form.Check className='px-3'>
                                                <Form.Check.Input name='sta_type' value='0' onChange={(e) => checkOnlyOne(e.target)} />
                                                <Form.Check.Label >정규직</Form.Check.Label>
                                            </Form.Check>
                                            <Form.Check className='px-3'>
                                                <Form.Check.Input name='sta_type' value='1' onChange={(e) => checkOnlyOne(e.target)} />
                                                <Form.Check.Label>계약직</Form.Check.Label>
                                            </Form.Check>
                                            <Form.Check className='px-3'>
                                                <Form.Check.Input name='sta_type' value='2' onChange={(e) => checkOnlyOne(e.target)} />
                                                <Form.Check.Label>일용직</Form.Check.Label>
                                            </Form.Check>
                                        </InputGroup>
                                    </div>

                                    <h4>입사일</h4>
                                    <InputGroup className='my-4'>
                                        <Form.Control className=' square border border-3 py-1'
                                            name="sta_employ" value={sta_employ} onChange={onChange} type='date' />
                                    </InputGroup>
                                    <h4>퇴사일</h4>
                                    <InputGroup className='my-4'>
                                        <Form.Control placeholder='퇴사일 ex)20230505' className='square border border-3 py-1' name="sta_end" value={sta_end}
                                            onChange={onChange} type='date' />
                                    </InputGroup>
                                    <div>
                                        <h4>근로계약서</h4>
                                        <img className='my-3' src={fileName} width='20%' />
                                        <Form.Control type='file'
                                            onChange={onChangeFile} />
                                    </div>
                                </Col>
                            </Row>
                            <div className='mt-3 d-flex justify-content-center'>
                                <Button className='py-2 px-3' style={{ backgroundColor: '#5272E9', borderRadius: '15px', fontSize: '1rem' }}
                                    onClick={onRegister}>등록하기
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default RegisterStaffPage2
