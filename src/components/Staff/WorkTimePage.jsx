import axios from 'axios';
import moment from 'moment';
import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { AlertContext } from '../AlertContext';
import Modal from 'react-bootstrap/Modal';
import {Col, Row} from 'react-bootstrap'

const WorkTimePage = () => {
    //use_id 가져오기!
    const [UseId, setUseId] = useState(sessionStorage.getItem('use_id'));

    //출근, 퇴근시간 읽을때 (read)
    const [read, setRead] = useState([]);
    const {setBox} = useContext(AlertContext);
    const currentDateTime = moment().format('YYYY년MM월DD일');

    //셀렉트박스 벨류정하기
    const dateType = [
        { text: '전체', value: 'all' },
        { text: '일주일', value: '7' },
        { text: '한달', value: 'month' },
    ]
    
    //기본값은 all
    const [selectedDateType, setSelectedDateType] = useState('all');
    //날짜유형
    const getDateType = () => {
        if (selectedDateType === '7') {
          // 일주일 동안
          return moment().subtract(7, 'days').format('YYYY-MM-DD');
        } else if (selectedDateType === 'month') {
          // 한달 동안
          return moment().startOf('month').format('YYYY-MM-DD');
        } else {
          // 전체 기간
          return '';
        }
      };
      //
      const filteredRead = read.filter((item) => { //선택한 날짜유형에 따라 read배열 필터링
        //getDateType을 통해 얻은 날짜
        const startDate = getDateType();
        if (startDate) {
          //기준으로부터 몇일?(같거나 이후)데이터만 filteredRead에 포함 , 
          return moment(item.start).isSameOrAfter(startDate);
        } else {
          // startDate가 존재하지 않는 경우, 모든 아이템을 필터링에 포함
          return true;
        }
      });

    //time_code : auto속성, 
    const [form, setForm] = useState({

        time_start:'',
        time_end:'',

    });
    const {time_start, time_end} = form;

    



    //데이터 읽어오기
    const onReadWork = async () => {
        try{
            const response = await axios.get(`/time/list.json?use_id=${UseId}`);
            setRead(response.data);
        }catch(err){
            console.error('출근시간 데이터읽기 오류:'+err);
        }
    };

    //출근버튼눌렀을떄
    const onWorkStart = async () => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');     
        // 이미 오늘 날짜의 출근 데이터가 있는지 확인
        const todayData = read.find(item => moment(item.start).isSame(moment(), 'day'));
      
        if (todayData) {
          setBox({
            show: true,
            message: '이미 출근신청이 완료되었습니다.',
          });
        } else {
          setBox({
            show: true,
            message: (
                <>
                <h4>{currentDateTime}</h4>
                <h3><span className="text-primary fw-bold">출근</span>하시겠습니까?</h3>
              </>
            ),
            action: async () => {
              try {
                await axios.post('/time/', { use_id: UseId, time_end: null });
                await onReadWork();
              } catch (error) {
                console.error('출근신청오류:', error);
              }
            },
          });
        }
      };
      
    
    //퇴근버튼 눌렀을때
    const onWorkEnd = async () => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      
        // 이미 오늘 날짜의 퇴근 데이터가 있는지 확인
        const todayData = read.find(item => moment(item.start).isSame(moment(), 'day'));
      
        if (todayData && todayData.end) {
          setBox({
            show: true,
            message: '이미 퇴근신청이 완료되었습니다.',
          });
        } else {
          setBox({
            show: true,
            message: (
              <>
                <h4>{currentDateTime}</h4>
                <h3><span className="text-danger fw-bold">퇴근</span>하시겠습니까?</h3>
              </>
            ),
            action: async () => {
              try {
                await axios.post('/time/update', { use_id: UseId });
                await onReadWork();
              } catch (error) {
                console.error('퇴근신청오류:', error);
              }
            },
          });
        }
      };
    
    //select
    const handleDateTypeChange = (e) => {
        const value = e.target.value;
        setSelectedDateType(value);
        onReadWork();
      };

    
    useEffect(() => {
        onReadWork();
    }, [selectedDateType]);
    
    return (
        <Row className="pb-5">
            <Col md={8} className="justify-content-center mx-5 my-3">
                <h2 className="text-start mt-2 pb-4">출・퇴근관리</h2>
                <Form>
                    <Card>
                        <Card.Header>
                            <h1 className='my-5'>{currentDateTime}</h1>
                            <div className="d-flex align-items-center justify-content-between my-2 mx-3">
                                <div>
                                    <Button className='mx-3 fw-bold fs-5'onClick={onWorkStart} >출근</Button>
                                    <Button className='btn-warning fw-bold fs-5'onClick={onWorkEnd} >퇴근</Button>
                                </div>
                                <select value={selectedDateType} onChange={handleDateTypeChange}>
                                    {dateType.map((option) => (
                                        <option key={option.value} value={option.value}>
                                        {option.text}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                        </Card.Header>
                        <Card.Body>
                        <table className="table">
                        <thead>
                            <tr>
                            <th scope="col"  style={{textAlign:'center'}}>근무일</th>
                            <th scope="col">출근시간</th>
                            <th className='pe-4'scope="col">퇴근시간</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                        {filteredRead.map((item) => (
                            <tr key={item.id}>
                                <th scope="row"  style={{textAlign:'center'}}>{moment(item.start).format('YYYY-MM-DD')}</th>
                                <td>{moment(item.start).format('HH:mm')}</td>
                                <td>{item.end}</td>
                            </tr>
                        ))}
                        </tbody>
                        </table>
                                </Card.Body>

                            </Card>
                        </Form>
            </Col>
         </Row>
    );
};

export default WorkTimePage