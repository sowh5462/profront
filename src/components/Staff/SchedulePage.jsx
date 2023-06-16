import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Row, Table } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);

  const localizer = momentLocalizer(moment);

  const getSchedule = async () => {
    const result = await axios.get(
      `/schedule/listStaff.json?use_id=${sessionStorage.getItem('use_id')}`
    );
      // console.log(result.data);
      setSchedule(result.data);
  };

  useEffect(() => {
    getSchedule();
  }, []);

  const getEventList = () => {
    return schedule.map((s)=>({
      title:`${s.start}-${s.work_name} `,
      start: moment(s.start).toDate(),
      end: moment(s.end).toDate(),
    }));
  };



  return (
    <div>
      <Row className="justify-content-center m-3">
        <Card className='m-3'>
          <Card.Title>
            <h3>근무내역</h3>
          </Card.Title>
          <Card.Body>
            <Table>
              <thead>
                <tr>
                  <td>요일</td>
                  <td>시작시간</td>
                  <td>종료시간</td>
                </tr>
              </thead>
              <tbody>
                {schedule.map((s) => (
                  <tr key={s.sche_id}>
                    <td>
                      {s.sche_day === 0
                        ? '월'
                        : s.sche_day === 1
                        ? '화'
                        : s.sche_day === 2
                        ? '수'
                        : s.sche_day === 3
                        ? '목'
                        : s.sche_day === 4
                        ? '금'
                        : s.sche_day === 5
                        ? '토'
                        : s.sche_day === 6
                        ? '일'
                        : ''}
                    </td>
                    <td>{s.start}</td>
                    <td>{s.end}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Row>
        <div className='justify-content-center m-3'>
          <Calendar
            localizer={localizer}
            events={getEventList()}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
    </div>
  );
};

export default SchedulePage;
