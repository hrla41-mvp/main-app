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
  render() {
    let currentRoom = this.props.currentRoom;
    var messageBody = document.getElementsByClassName('MessageBoardContainer');
    if (messageBody[0] === undefined) {
    } else {
      messageBody[0].scrollTop = messageBody[0].scrollHeight;
    }
    return (
      <>
        <div className="FriendsList">
          <div className="RoomNameCard">{currentRoom.room_name}</div>
          <div className="PeopleInRoom">People In The Room
          {(currentRoom.users) ? <RenderPeople currentRoom={currentRoom} /> : null}
          </div>
          <input type="text" placeholder="Type a username" className="EnterUsername"></input>
        </div>
      </>
    )
  }
}
export default FriendsList;