import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import PayChart from './PayChart';
import PayChart2 from './PayChart2';


const PayRollPage = () => {
    const [pay, setPay] = useState();
    const [total, setTotal] = useState();
    const [temp, setTemp] = useState();
    const [info, setInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getPayRoll = async () => {
        setLoading(true);
        const use_work_num = 1288663802;
        const result = await axios.get(`/payroll/sum?use_work_num=${use_work_num}`);
        setPay(result.data);
        const result2 = await axios.get(`/payroll/total?use_work_num=${use_work_num}`);
        setTotal(result2.data);
        const result3 = await axios.get(`/payroll/temp?use_work_num=${use_work_num}`);
        setTemp(result3.data);
        const result4 = await axios.get(`/payroll/info?use_work_num=${use_work_num}`);
        setInfo(result4.data);
        setLoading(false);
    };

    useEffect(() => {
        getPayRoll();
    }, []);



    if (loading) return <Spinner animation='border' className='position-absolute top-50 start-50' />
    return (
        <>
            <Row className='justify-content-center'>
                <Col md={6}>
                    <Card>
                        <Row>
                            <Col>
                                <h4>인건비</h4>
                                <br />
                                <h2>{pay}원</h2>
                            </Col>
                            <Col>
                                <h4>직원수</h4>
                                <br />
                                <h2>{total}명</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h4>일용직</h4>
                                <br />
                                <h2>{temp}원</h2>
                            </Col>
                            <Col>
                                <Button className='mt-4' onClick={handleShow}>급여상세보기</Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row className='justify-content-center mt-3'>
                <Col md={3}>
                    <PayChart />
                </Col>
                <Col md={3}>
                    <PayChart2 />
                </Col>
            </Row>

            <Offcanvas show={show} onHide={handleClose} placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>급여 상세목록</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Table className='text-center'>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>타입</th>
                                <th>금액</th>
                                <th>날짜</th>
                            </tr>
                        </thead>
                        <tbody>
                            {info.map(i =>
                                <tr>
                                    <td>{i.use_name}</td>
                                    <td>{i.sta_type === 0 ? "정규직" :
                                        i.sta_type === 1 ? "계약직" :
                                        i.sta_type === 2 ? "일용직" : ""}</td>
                                    <td>{i.fmt_pay_regular}</td>
                                    <td>{i.pay_month}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default PayRollPage