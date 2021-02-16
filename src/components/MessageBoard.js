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
      <div className="MessageBoardContainer">
        <div>
          <h1 className="roomName">Room Name Here</h1>
        </div>
        <div>
          <RenderMessages />
        </div>
        <div>
          <input className="newMessageInput" type="text" placeholder="Whats on your mind?" ></input>
        </div>
      </div>
    )
  }
}
export default MessageBoard;


