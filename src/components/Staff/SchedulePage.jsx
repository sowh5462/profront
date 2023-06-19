import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Col, Row} from 'react-bootstrap'

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
        <Row className='ps-5 py-4'>
          <h2 className="text-start pb-4 fw-normal">주간 근무표</h2>
          <Col md={10}>
            <Calendar
              localizer={localizer}
              events={getEventList()}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, width: "100%" }} 
              min={8}
            />
          </Col>
        </Row>
    </div>
  );
};

export default SchedulePage;
