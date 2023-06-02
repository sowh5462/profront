import React, { useState } from 'react'
import { Col, Row, Button } from 'react-bootstrap';

const [type, setType] = useState(0);

const MasterListUpdate = () => {
  return (
    <Row>
      <Col>
        <Button>수정</Button>
      </Col>
    </Row>
  )
}

export default MasterListUpdate