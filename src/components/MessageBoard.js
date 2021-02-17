import React from 'react';
import '../css/Messageboard.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import RenderMessages from './RenderMessages.js';


class MessageBoard extends React.Component {
  constructor(props) {
    super(props)
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
          {this.props.messages.map(element => (
            <RenderMessages messages={element} />
          ))}
        </div>
        <div>
          <form>
            <input className="newMessageInput" type="text" placeholder="Whats on your mind?" onChange={this.props.handleInput}></input>
            {/* <input type="submit" name="SubmitButton" onSubmit={this.handleSendMessage}></input> */}
            <button name="Submit" onClick={this.props.handleSendMessage}>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}
export default MessageBoard;


