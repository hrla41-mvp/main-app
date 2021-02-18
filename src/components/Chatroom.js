import React from 'react';
import '../css/Chatroom.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import RenderRooms from './RenderRooms'

class Chatroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render() {
    return (
      <div className="MainChatRoomContainer">
        <div className="chatRoomsList">
          <RenderRooms
            chatRoomsList={this.props.chatRoomsList}
            updateCurrentRoom={this.props.updateCurrentRoom}
          />
        </div>
        <div>
          <input className="newRoomInput" id="typedValue" type="text" placeholder="Add A New Room" onKeyPress={this.props.addRoom}></input>
        </div>
      </div>
    )
  }
}
export default Chatroom;

// Button
/* <Button className="newChatButton" style={{background: '#2e2e2e', border: '0px'}} > <svg stroke="currentColor" fill="currentColor" strokeWidth="0" t="1551322312294" viewBox="0 0 1024 1024" version="1.1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <defs></defs>
              <path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"></path>
              <path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"></path>
            </svg> </Button>
            */