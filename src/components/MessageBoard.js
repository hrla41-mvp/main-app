import React from 'react';
import '../css/Messageboard.css';
import { Button, Container, Row, Col } from 'react-bootstrap';

class MessageBoard extends React.Component {
  constructor() {
    super()
    this.state = {

    }
  }
  render() {
    return (
      <div className="MessageBoard">
        <Container fluid>
          <Row>
            <Col className="RoomName">Room Here</Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col className="MessagesView">Room Here</Col>
          </Row>
        </Container>
      </div>
    )
  }
}
export default MessageBoard;