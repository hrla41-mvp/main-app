import React from 'react';
import '../css/FriendsList.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import RenderPeople from './RenderPeople.js';

class FriendsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render () {
    console.log('propppss', this.props)
    var messageBody = document.getElementsByClassName('MessageBoardContainer');
    if (messageBody[0] === undefined) {
    } else {
      messageBody[0].scrollTop = messageBody[0].scrollHeight;
      // console.log(messageBody)
    }
    return(
      <>
      <div className="FriendsList">
        <div className="RoomNameCard">{`${this.props.user.first_name} ${this.props.user.last_name}`}</div>
        <div className="PeopleInRoom">People In The Room
          <RenderPeople
            user={this.props.user}
            roomUsers={this.props.roomUsers}
          /></div>
        <input type="text" placeholder="Type a username" className="EnterUsername"></input>
      </div>
      </>
    )
  }
}
export default FriendsList;

/*
      <div className="FriendsList">
        <Container fluid>
          <Row>
            <Col className="RoomNameCard">{this.props.room}</Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col className="PeopleInRoom">People In The Room <RenderPeople
            userName={this.props.user}
            roomUsers={this.props.roomUsers}
            /></Col>
          </Row>
            <input type="text" placeholder="Type a username" className="EnterUsername"></input>
        </Container>
      </div>
*/