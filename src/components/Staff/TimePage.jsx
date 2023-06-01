import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap';

const TimePage = () => {
    const [time, setTime] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const getTime = async () => {
    }

    useEffect(() => {
        getTime();
    },[]);
    return (
        <Row>
            <Col>
                <h1 className='text-center my-5'>5월 23일</h1>
                <Row>
                    <Col className='my-3'>
                        <Button className='mx-3'>출근</Button>
                        <Button>퇴근</Button>
                    </Col>
                </Row>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>근무일</th>
                            <th>출근시간</th>
                            <th>퇴근시간</th>
                            <th>휴게시간</th>
                            <th>....</th>
                        </tr>
                    </thead>
                    <tbody style={{fontSize:'0.8rem'}}>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}

export default TimePage