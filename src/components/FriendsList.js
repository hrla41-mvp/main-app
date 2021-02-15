import React from 'react';
import '../css/FriendsList.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import RenderPeople from './RenderPeople.js';

class FriendsList extends React.Component {
  constructor() {
    super()
    this.state = {

    }
  }
  render () {
    return(
      <div className="FriendsList">
        <Container fluid>
          <Row>
            <Col className="RoomNameCard">Room Name</Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col className="PeopleInRoom">People <RenderPeople /></Col>
          </Row>
            <input type="text" placeholder="Type a username" className="EnterUsername"></input>
        </Container>
      </div>
    )
  }
}
export default FriendsList;