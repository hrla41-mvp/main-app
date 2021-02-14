import React from 'react';
import '../css/Chatroom.css';
import { Button, Container, Row, Col } from 'react-bootstrap';

class Chatroom extends React.Component {
  constructor() {
    super()
    this.state = {

    }
  }
  render() {
    return (
      <>
        <Container className="MainChatRoom">
        </Container>
        <Container>
          <Row>
            <input type="text" className="typeNewMessage" placeholder="New Chat"></input>
            <Button> Send </Button>
          </Row>
        </Container>
      </>
    )
  }
}
export default Chatroom;