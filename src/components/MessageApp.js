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
          <Col className="messageAppCol" style={{backgroundColor: '#283957'}}> <Chatroom /> </Col>
          <Col className="messageAppCol"  style={{backgroundColor: '#87010f'}}xs={7}> <MessageBoard /> </Col>
          <Col className="messageAppCol" style={{backgroundColor: '#548c5d'}}> <FriendsList /> </Col>
        </Row>
      </Container>
    )
  }
}

