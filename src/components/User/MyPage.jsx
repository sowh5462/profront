import axios from 'axios';
import React, { useContext, useRef, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, InputGroup, Row} from 'react-bootstrap'
import { AlertContext } from '../AlertContext';
import { withRouter } from 'react-router-dom/cjs/react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

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
        sta_file:null,
        sta_contract:'',
        sta_cFile:null,
        start:'',
        end: '',
        use_email:'',
        use_birth:'',
        use_address:'',
        work_address:'',
        work_name:'',
        use_email:'',
        use_address:'',
        use_phone:''
    });
    const {use_name,  sta_bank, sta_account, sta_type, sta_file, sta_cFile,
         sta_image, sta_contract, start, end,  work_address, work_name, use_email, use_address, use_phone} = form;

    const use_id = sessionStorage.getItem('use_id');

    const storage = getStorage();
    const getUser = async () => {
        const result = await axios.get(
        `/user/sread?use_login_id=${sessionStorage.getItem('use_login_id')}`);

        setForm(result.data);
        setFileName(result.data.sta_contract ?
            result.data.sta_contract:"https://via.placeholder.com/50x50");
            // console.log(fileName);
        setUserImage(result.data.sta_image ? result.data.sta_image:"https://via.placeholder.com/50x50" );
    };
      useEffect(() => {
        getUser();
    },[]);

   


    //유저이미지 수정
    const selectedFile = (e) => {
        const file = e.target.files[0];
        const filesName = e.target.files[0].name;
        setUserImage(URL.createObjectURL(file));
        setForm({ ...form,  sta_file: file, sta_image:filesName});
        // console.log(e.target.files[0].name);
    };

    //근로계약서
    const onChangeFile = (e) => {
        const file = e.target.files[0];
        setFileName(URL.createObjectURL(file));
        setForm({ ...form, sta_cFile: file });
    };

    const onUpdate = async () => {
        const profileRef = ref(storage, 'profiles/' + use_id + 'profileImage');
        const contractRef = ref(storage, 'contracts/' + use_id + 'contractImage');
        const metadata = {contentType : 'image/jpeg'};
        if(sta_file){
            uploadBytes(profileRef, sta_file, metadata).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    setForm({...form, sta_image:url});
                  })
            });
        };
        if(sta_cFile){
            uploadBytes(contractRef, sta_cFile, metadata).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    setForm({...form, sta_contract:url});
                  })
            });
        };
        await axios.post('/user/supdate', form);
        await axios.post(`/user/wupdate`,form);
    };

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

         <Row className='justify-content-center mt-5 px-5'>
            <Col md={6}>
                <Col>
                    <Card className="py-3 px-3">
                        <Card className='m-2 p-3'>
                            <div className='d-flex m-3'>
                        {sta_image ?
                            <img  style={{borderRadius:"50%"}} src={userImage} alt="유저이미지" width='100px' onClick={handleImageClick}/> 
                            : 
                            <img alt="유저이미지" src="http://via.placeholder.com/100x100" onClick={handleImageClick} width='100px'/>}
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
                        <Form className='text-start m-2 pt-2 px-2'>
                            <h4 className='mx-2'>주소</h4>
                            <Form.Control value={use_address}
                                name="use_address"
                                onChange={onChange}
                                readOnly={!isEditMode}
                                />
                        </Form>
                        <Form className='text-start m-2 pb-2 px-2'>
                            <h4 className='mx-2'>전화번호</h4>
                            <Form.Control value={use_phone}
                                name="use_phone"
                                onChange={onChange}
                                readOnly={!isEditMode}
                                />

                        </Form>
                        </Card>
                        <Card className='m-2 py-2 px-2'>
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
                <Card className="py-2 px-3">
                    <Col>
                        <Card className='m-2 mt-3 px-2'>
                            <div className='text-start m-2 fs-5'>💼 근무지정보</div>
                            <h3>[{work_name}]</h3>
                            <div className='mb-4 fs-'>{work_address}</div>
                        </Card>
                        <Card className='m-2 mt-3 fs-5'>
                            <div className='text-start m-2 px-2'>👤 근로형태 
                             <span className='p-2' name='sta_type'>{sta_type===0 ? '[정규직]' : sta_type===1 ? '[계약직]': sta_type===2 ? '[일용직]':''}</span>
                            </div>                         
                            <div className='p-2'>입사일 : {start}</div>
                            <div className='pb-3'>퇴사일 : {end}</div>
                        </Card>
                    </Col>
                    <Col>
                        <Form>
                        <Card className='m-2'>
                            <Card.Title>
                                <div className='mt-3 text-start px-3 fs-5'>📄 근로계약서</div>
                            </Card.Title>
                                <Card.Body>
                                    <div>
                                        <img className='pb-2' alt="근로계약서"  src={fileName} width="150px"/>
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
                    
                    
                </Card>
                
                </Col>
            </Row>
            <div className='m-3'>
                    {isEditMode ? (
                    <Button onClick={onClickSave}
                        className='me-2 btn-warning'>저장</Button>
                    ) : (
                    <Button onClick={onClickEidt} className='me-2'>
                        수정
                    </Button>
                    )}
                    <Button onClick={onReset2}
                        className='me-2 btn-secondary'>취소</Button>
                </div>
     
          </>
  )
}

export default withRouter(MyPage)