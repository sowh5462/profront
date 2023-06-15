import moment from 'moment/moment';
import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Col, Row } from 'react-bootstrap';

const SchedulePage = () => {
  moment.locale('ko-KR');
  const localizer = momentLocalizer(moment);
  const [view, setView] = useState(Views.WEEK);

  const handleViewChange = view => {
    setView(view);
  };

  const onView = view => {
    const startHour = 8; // 시작 시간 (오전 8시)
    const endHour = 23; // 종료 시간 (오후 11시)

    const newStart = new Date(view.start);
    newStart.setHours(startHour, 0, 0, 0);

    const newEnd = new Date(view.end);
    newEnd.setHours(endHour, 0, 0, 0);

    return {
      start: newStart,
      end: newEnd
    };
  };

  return (
    <Container>
      <Row className='justify-content-center'>
        <Col md={10}>
          <Calendar
            localizer={localizer}
            events={[
              {
                id: 1,
                title: '롯데리아',
                start: new Date(2023, 5, 15, 8, 0),
                end: new Date(2023, 5, 15, 16, 0)
              },
              {
                id: 1,
                title: '롯데리아',
                start: new Date(2023, 5, 16, 8, 0),
                end: new Date(2023, 5, 16, 16, 0)
              }
            ]}
            style={{ height: 800 }}
            view={view}
            onView={handleViewChange}
            views={['week']}
            min={new Date(2023, 5, 15, 8, 0)}
            max={new Date(2023, 5, 15, 23, 59)} // 11시 이전까지 표시되도록 설정
            toolbar={true}
            getDrilldownView={onView}
            startAccessor="start"
            endAccessor="end"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default SchedulePage;
