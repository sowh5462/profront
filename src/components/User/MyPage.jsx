import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import { AlertContext } from '../AlertContext';

const MyPage = ({history}) => {
    const {setBox} = useContext(AlertContext);
    const [fileName, setFileName] = useState('');
    const [form, setForm] = useState({
        use_id:'',
        use_login_id:'',
        use_login_pass:'',
        use_work_num:'',
        use_name:'',
        use_birth:'',
        use_address:'',
        use_email:'',
        use_join:'',
        use_type:'',
        use_phone:'',
        sta_bank:'',
        sta_account:'',
        sta_type:'',
        sta_image:'',
        sta_employ:'',
        sta_end:'',
        sta_contract:'',
        start:'',
        end: '',
        ujoin:'',
        work_address:'',
        work_name:'',
        file: null
    });
    const {use_id, use_login_id, use_login_pass, use_work_num, use_name, use_birth, use_address, use_email, use_join, use_type, use_phone, sta_bank, sta_account, sta_type,
         sta_image, sta_employ, sta_end, sta_contract, start, end, ujoin, work_address, work_name, file} = form;
    const getUser = async () => {
        const result = await axios.get(
        `/user/sread?use_login_id=${sessionStorage.getItem('use_login_id')}`);
        setForm(result.data);
        setFileName(result.data.sta_contract ?
            `/images/photos/${result.data.sta_contract}`:"https://via.placeholder.com/50x50");
    }
    
      useEffect(() => {
        getUser();
    },[])

    const onChangeFile = (e) => {
        setFileName(URL.createObjectURL(e.target.files[0]));
        setForm({...form, file:e.target.files[0]});
    }

    const onChange = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

    const onReset = () => {
        setBox({
            show:true,
            message:'수정한 내용을 취소할까요?',
            action: getUser
        });
    }
    const onUpdate = async() => {
        const formData = new FormData();
        formData.append('sta_bank', sta_bank);
        formData.append('sta_account', sta_account);
        formData.append('sta_image', sta_image);
        formData.append('sta_contract', sta_contract);
        formData.append('file', file);
        const config = {
            headers: {"content-type":"multipart/form-data"}
        }
        await axios.post('/user/supdate', formData, config);
        history.push('/');
    }

    const onClickUpdate = () => {
        setBox({
            show: true,
            message: '수정된 내용을 저장할까요?',
            action: onUpdate
        });
    }

  return (
    <div>
        <div>
            <h4 className="text-start">마이페이지</h4>
        </div>
        <Row className='justify-content-center m-5'>
            <Col>
                <Card>
                    <Card.Title className='m-3'>
                    {sta_image ?
                    <img src={sta_image} width='10%'/> : <img src="http://via.placeholder.com/50x50" width='10%'/>}
                    <h3><b>{use_name}</b>님의 정보</h3>
                    </Card.Title>
                    <Card.Body>
                        <h5 className='text-start mx-2'>계좌정보</h5>
                        <Form>
                        <InputGroup className='my-2'>
                        <InputGroup.Text className='px-5'>은행</InputGroup.Text>
                        <Form.Control value={sta_bank}
                            name="sta_bank" onChange={onChange}/>
                    </InputGroup>
                    <InputGroup className='my-2'>
                        <InputGroup.Text className='px-5'>계좌</InputGroup.Text>
                        <Form.Control value={sta_account}
                            name="sta_account" onChange={onChange}/>
                    </InputGroup>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className='justify-content-center m-5'>
            <Card>
                <h4 className='text-start'>직장관리</h4>
                    <Row>
                <Col md={6}>
                    <Form>
                        <Card>  
                            <Button className='m-2 text-start'>[{work_name}]</Button>
                        </Card>
                    <Card>
                        <Card.Title>
                            <Button>근로계약서 업로드</Button>
                        </Card.Title>
                            <Card.Body>
                                <div>
                                    <img className='my-3' src={fileName} width="20%"/>
                                    <Form.Control type='file'
                                        onChange={onChangeFile}/>
                                </div>
                            </Card.Body>   
                    </Card>
                    </Form>
                </Col>
                <Col>
                    <Card>
                        <h1>{work_name}</h1>
                        {work_address}
                    </Card>
                    <Card>
                        <Button className='btn btn-secondary' name='sta_type'>{sta_type===0 ? '정규직' : sta_type===1 ? '계약직': sta_type===2 ? '일용직':'아르바이트'}</Button>
                    </Card>
                    <Card>
                        <Button>가입일 : {start}</Button>
                    </Card>
                    <Card>
                        <Button>퇴사일 : {end}</Button>
                    </Card>
                </Col>
                </Row>
            </Card>
            <div>
                <Button onClick={onClickUpdate}
                    className='me-2'>저장</Button>
                <Button onClick={onReset}
                    className='me-2'>취소</Button>
            </div>
        </Row>
    </div>
  )
}

export default MyPage