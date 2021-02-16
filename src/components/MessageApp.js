import { Button, Container, Row, Col } from 'react-bootstrap';
import React, { Component } from 'react';
import '../css/MessageApp.css';
import Chatroom from './Chatroom';
import MessageBoard from './MessageBoard';
import FriendsList from './FriendsList';

export default class MessageApp extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <Container fluid className="messageAppContainer">
        <Row className="messageAppRow">
          <Col className="messageAppCol" > <Chatroom /> </Col>
          <Col className="messageAppCol" xs={6}> <MessageBoard /> </Col>
          <Col className="messageAppCol" > <FriendsList /> </Col>
        </Row>
      </Container>
    )
  }
}

