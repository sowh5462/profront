import axios from 'axios';
import moment from 'moment';
import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { AlertContext } from '../AlertContext';
import Modal from 'react-bootstrap/Modal';

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
        const response = await axios.get(`/time/list.json?use_id=${UseId}`);
        setRead(response.data);
    };

    //출근버튼눌렀을떄
    const onWorkStart = async () => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        setBox({
            show:true,
            message:
                <>
                    <h5>`{currentDateTime}`</h5>
                    <h3>출근하시겠습니까?</h3>
                </>
                ,
            action: async()=>{
                await axios.post('/time/', { use_id: UseId , time_end: null});
                onReadWork();
            }
        })
    };
    //퇴근버튼 눌렀을때
    const onWorkEnd = async () => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        //모달창
        setBox({
            show:true,
            message:
                <>
                    <h5>`{currentDateTime}`</h5>
                    <h3>퇴근하시겠습니까?</h3>
                </>
                ,
            action: async()=>{
                await axios.post('/time/update', { use_id: UseId }); // 데이터 업데이트 요청
                onReadWork(); // 데이터 다시 가져오기
            }
        })    
    };
    //셀ㄺ
    const handleDateTypeChange = (e) => {
        const value = e.target.value;
        setSelectedDateType(value);
        // 선택한 옵션에 따라 데이터를 필터링하거나 추가적인 로직을 수행
        // 여기에서는 데이터를 모두 가져오도록 설정
        onReadWork();
      };

    
    useEffect(() => {
        onReadWork();
    }, [selectedDateType]);
    
    return (
        <div>
            <Form>
                <Card className='mx-5 my-5' >
                    <Card.Header>
                        <h1 className='my-5'>{currentDateTime}</h1>
                        <div className="d-flex align-items-center justify-content-between my-2 mx-3">
                            <div>
                                <Button className='mx-3'onClick={onWorkStart} >출근</Button>
                                <Button className=''onClick={onWorkEnd} >퇴근</Button>
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
    </div>
    );
};

export default WorkTimePage