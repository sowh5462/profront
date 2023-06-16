import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
