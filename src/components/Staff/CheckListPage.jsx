import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react'
import {Row, Col , Table} from 'react-bootstrap'
import moment from 'moment';
import { AlertContext } from '../AlertContext';

const CheckListPage = () => {
    const {setBox} = useContext(AlertContext);
    const [list, setList] = useState([]);
    const use_id = sessionStorage.getItem("use_id");

    const getCheckList = async() =>{
        try{
            const result = await axios.get(`/check/staff?use_id=${use_id}`);
            setList(result.data);
        }catch(err){
            setBox({
                show:true,
                message:"결재내역 리스트를 가져오는데 실패했습니다"+err
            })
        }
    }

    useEffect(()=>{
        getCheckList();
    },[]);

    if(list.length === 0) return <h3 style={{paddingBottom:"800px"}}>결재 신청내역이 존재하지 않습니다</h3>

    return (
        <Row style={{paddingBottom:"500px"}}>
            <h3 className="text-start pt-2 pb-5">결재내역</h3>
            <Col md={10}>
                <Table className="table">
                    <thead>
                        <tr className="table-secondary" style={{fontWeight:"500"}}>
                            <td>구분</td>
                            <td>결재신청일</td>                          
                            <td>시작일/시간</td>
                            <td>종료일/시간</td>
                            <td>신청일수/시간</td>
                            <td>승인여부</td>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(c=>(
                            <tr key={c.chk_code}>
                                <td className="fw-bold">{c.chk_type}</td>
                                <td>{c.day}</td>
                                <td>{c.chk_type==="연차" ? c.start : moment(c.chk_start).format('HH:mm')}</td>
                                <td>{c.chk_type==="연차" ? c.end : moment(c.chk_end).format('HH:mm')}</td>
                                <td>{c.chk_type==="연차" ? c.chk_time+" 일" : c.chk_time+" 시간"}</td>
                                <td>{c.chk_confirm===1 ? <span className="text-primary">신청중</span>
                                : c.chk_confirm===2 ? <span className="text-secondary">승인완료</span>
                                : <span className="text-danger">반려</span>}</td>                            
                         </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}

export default CheckListPage