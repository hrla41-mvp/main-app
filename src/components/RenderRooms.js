import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/RenderRooms.css';

 // THIS COMPONENT IS TO DYNAMICALLY RENDER ROOMS USE MAP

const RenderRooms = () => {
  return (
    <>
      <Container fluid className="RoomsCard" >
        <Row>
          <Col className="RoomsName">Room Name Here</Col>
        </Row>
      </Container>
      <Container fluid className="RoomsCard" >
        <Row>
          <Col className="RoomsName">Room Name Here</Col>
        </Row>
      </Container>
    </>
  )
};

export default RenderRooms;