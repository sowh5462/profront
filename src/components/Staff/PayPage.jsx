import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import PayStaffChart from './PayStaffChart';

const PayPage = () => {
    const [stubs, setStubs] = useState([]);
    const [todayPay, setTodayPay] = useState([]);
    const [untill, setUntill] = useState(0);
    const use_id = sessionStorage.getItem("use_id");
    
    const getStubs = async() => {
        const res = await axios.get(`/payroll/staff/stub/list.json?use_id=${use_id}`);
        setStubs(res.data);
    };

    const now = new Date();
    const today = now.getDay();
    const week = [6, 0, 1, 2, 3, 4, 5]; // 0부터 6까지의 요일을 원하는 순서대로 매핑
    const dayOfWeek = week[today];
    let time = {
        year: now.getFullYear(),  //현재 년도
        month: (now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1), // 현재 월
        date: now.getDate() > 9 ? now.getDate() : '0' + now.getDate() // 현재 날짜
      };
    
    let timestring = `${time.year}-${time.month}-${time.date}`;

    const getPay = async() => {
        const res = await axios.get(`/payroll/today?use_id=${use_id}`);
        setTodayPay(res.data);
        console.log(res.data);
        const res2 = await axios.get(`/payroll/untill?use_id=${use_id}&date=${timestring}`);
        setUntill(res2.data);
    };

    const selectedPay = todayPay.length > 0 ? todayPay.find(item => item.sche_day === dayOfWeek) || { sche_day: 9 } : {sche_day: 0};


    const untillPay = untill * 9620;

    useEffect(()=>{
        getStubs();
        getPay();
    }, []);

    return (
        <Row className='my-5 px-5'>
            <Col md={6}>
                <Row>
                    <Col>
                        <Card>
                            <h1>{untillPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</h1>
                            {selectedPay.sche_day === dayOfWeek ? 
                            <h4 className='text-primary'>당일 예정 수입은 {(parseInt(selectedPay.work_time) * 9620).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 입니다.</h4>
                            : <h4>당일 예정 수입은 0원 입니다.</h4>
                            }
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <PayStaffChart/>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Card>
                    <Card.Header className='fs-2'>급여명세서</Card.Header>
                    <Card.Body>
                        {stubs.map(s => 
                            <h4 key={s.stub_id} onClick={()=>{window.open(s.stub_url, '_blank')}} className='my-3 border-top border-bottom border-3 py-3'>
                                {s.stub_name}
                            </h4>
                        )}
                    </Card.Body>
                </Card>
                
            </Col>
        </Row>
    )
}

export default PayPage