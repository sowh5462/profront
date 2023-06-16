import axios from 'axios';
import React, { useContext, useRef, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, InputGroup, Row} from 'react-bootstrap'
import { AlertContext } from '../AlertContext';
import { withRouter } from 'react-router-dom/cjs/react-router-dom';

const MyPage = ({history}) => {
    const {setBox} = useContext(AlertContext);
    const [fileName, setFileName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const fileInput = useRef(null);
    const [form, setForm] = useState({
        use_name:'',
        sta_bank:'',
        sta_account:'',
        sta_type:'',
        sta_image:'',
        sta_contract:'',
        start:'',
        end: '',
        use_email:'',
        use_birth:'',
        use_address:'',
        use_phone:'',
        work_address:'',
        work_name:'',
        file: null,
        sta_file:null
    });
    const {use_id, use_name,  sta_bank, sta_account, sta_type, use_email, use_address, use_phone,
         sta_image, sta_contract, start, end,  work_address, work_name, file, sta_file} = form;

    const getUser = async () => {
        const result = await axios.get(
        `/user/sread?use_login_id=${sessionStorage.getItem('use_login_id')}`);

        setForm(result.data);
        setFileName(result.data.sta_contract ?
            `/images/photos/${result.data.sta_contract}`:"https://via.placeholder.com/50x50");
            // console.log(fileName);
        setUserImage(result.data.sta_image ? `/images/photos/${result.data.sta_image}`:"https://via.placeholder.com/50x50" );
    }
      useEffect(() => {
        getUser();
    },[])

   
    //근로계약서
    const onChangeFile = (e) => {
        setFileName(URL.createObjectURL(e.target.files[0]));
        setForm({...form, file:e.target.files[0]});
    }

    //유저이미지 수정
    const selectedFile = (e) => {
        setUserImage(URL.createObjectURL(e.target.files[0]));
        setForm({...form, sta_image:e.target.files[0].name,  sta_file:e.target.files[0]});
        // console.log(e.target.files[0].name);
    }

    //폼 수정
    const onChange = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }
    
    //취소버튼
    const onReset2 = () => {
        setBox({
            show:true,
            message:'수정을 취소할까요?',
            action: onResete
        });
    }
    const onResete = () => {
        getUser();
        setIsEditMode(false);
    };
    const onUpdate = async() => {
        const formData = new FormData();
        formData.append('use_id',use_id);
        formData.append('sta_bank', sta_bank);
        formData.append('sta_account', sta_account);
        formData.append('sta_image', sta_image);
        formData.append('sta_contract', sta_contract);
        formData.append('file', file);
        formData.append('sta_file', sta_file);
        formData.append('use_address', use_address);
        formData.append('use_phone', use_phone);
        const config = {
            headers: {"content-type":"multipart/form-data"}
        }
        await axios.post('/user/supdate', formData, config);
        await axios.post('/user/wupdate', form);
        history.push('/staff');
        // console.log(form);
    }


    const onClickUpdate = () => {
        setBox({
            show: true,
            message: '수정된 내용을 저장할까요?',
            action: onUpdate
        });
    }

    const onClickEidt = () => {
        setIsEditMode(true);
    };

    const onClickSave = () => {
        onClickUpdate();
        setIsEditMode(false);
    };

    const handleImageClick = () => {
        if (fileInput.current) {
        fileInput.current.click();
        }
    };
    

  return (
        <>
        <Container>
         <Row className='justify-content-center m-5'>
            <Col md={6}>
                <Col>
                    <Card>
                        <Card className='m-2 p-3'>
                            <div className='d-flex m-3'>
                        {sta_image ?
                            <img src={userImage} alt="유저이미지" width='10%' onClick={handleImageClick}/> 
                            : 
                            <img alt="유저이미지" src="http://via.placeholder.com/50x50" onClick={handleImageClick} width='10%'/>}
                            {isEditMode && (
                                <Form.Control type='file'
                                    name="sta_file"
                                    onChange={selectedFile}
                                    ref={fileInput}
                                    style={{display:'none'}}
                                    />
                                )}
                                <div className="m-3">
                                    <h3><b>{use_name}</b>님의 정보</h3>
                                    <h5>{use_email}</h5>
                                </div>
                            </div>
                        </Card>
                        <Card className='m-2'>
                        <Form className='text-start m-2'>
                            <h4 className='mx-2'>주소</h4>
                            <Form.Control value={use_address}
                                name="use_address"
                                onChange={onChange}
                                readOnly={!isEditMode}
                                />
                        </Form>
                        <Form className='text-start m-2'>
                            <h4 className='mx-2'>전화번호</h4>
                            <Form.Control value={use_phone}
                                name="use_phone"
                                onChange={onChange}
                                readOnly={!isEditMode}
                                />
                        </Form>
                        </Card>
                        <Card className='m-2'>
                            <h5 className='text-start m-2'>계좌정보</h5>
                            <Form className='mx-3'>
                                <InputGroup className='my-2'>
                                    <InputGroup.Text className='px-5'>은행</InputGroup.Text>
                                    <Form.Control value={sta_bank}
                                        name="sta_bank" onChange={onChange}
                                        readOnly={!isEditMode}/>
                                </InputGroup>
                                <InputGroup className='my-2'>
                                    <InputGroup.Text className='px-5'>계좌</InputGroup.Text>
                                    <Form.Control value={sta_account}
                                        name="sta_account" onChange={onChange}
                                        readOnly={!isEditMode}/>
                                </InputGroup>
                            </Form>
                        </Card>
                    </Card>
                </Col>
            </Col>
            
            <Col md={6}>
                <Card>
                    <Col>
                        <Form>
                        <Card className='m-2'>
                            <Card.Title>
                                <div className='m-2 text-start'>근로계약서</div>
                            </Card.Title>
                                <Card.Body>
                                    <div>
                                        <img alt="근로계약서" className='my-3' src={fileName} width="22%"/>
                                        <Form.Control type='file'
                                            name="file"
                                            onChange={onChangeFile}
                                            style={{display: isEditMode ? 'block' : 'none'}}
                                            />
                                    </div>
                                </Card.Body>
                        </Card>
                        </Form>
                    </Col>
                    <Col>
                        <Card className='m-2 mt-3'>
                            <div className='text-start m-2'>회사정보</div>
                            <h1>[{work_name}]</h1>
                            <div className='m-2'>{work_address}</div>
                        </Card>
                        <Card className='m-2 mt-4'>
                            <div className='text-start m-2'>회원타입</div>
                            <div className='p-2' name='sta_type'>{sta_type===0 ? '정규직' : sta_type===1 ? '계약직': sta_type===2 ? '일용직':''}</div>
                            <div className='p-2'>가입일 : {start}</div>
                            <div className='p-2'>퇴사일 : {end}</div>
                        </Card>
                    </Col>
                    
                </Card>
                
                </Col>
            </Row>
            <div className='m-3'>
                    {isEditMode ? (
                    <Button onClick={onClickSave}
                        className='me-2'>저장</Button>
                    ) : (
                    <Button onClick={onClickEidt} className='me-2'>
                        수정
                    </Button>
                    )}
                    <Button onClick={onReset2}
                        className='me-2'>취소</Button>
                </div>
            </Container>
          </>
  )
}

export default withRouter(MyPage)