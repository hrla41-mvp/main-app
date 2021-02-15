import React from 'react';
import '../css/Messageboard.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import RenderMessages from './RenderMessages.js';

class MessageBoard extends React.Component {
  constructor() {
    super()
    this.state = {

    }
  }
  render() {
    return (
      <div className="MessageBoard">
        <Container className="RoomNameHolder" fluid>
          <Row>
            <Col className="RoomName">Room Here</Col> {/* Can pass props and add room name here to dynamically render the room name */}
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col className="MessagesView"><RenderMessages /></Col>
          </Row>
        </Container>
        <Container>
          <input type="text" placeholder="What's on your Mind?"  className="sendMessageForm" important></input>
        </Container>
      </div>
    )
  }
}
export default MessageBoard;