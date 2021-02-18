import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/Landingpage.css';
const LandingPage = () => {
return(
  <div className="landingPage" fluid>
    <Container>
      <Col className="nameOfApp">NAME HERE</Col>
    </Container>
    <Container fluid>
      <Row>
        <Col>1 of 2</Col>
        <Col>2 of 2</Col>
      </Row>
    </Container>
  </div>
)
};

export default LandingPage;