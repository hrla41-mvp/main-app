import React from 'react';
import '../css/Messageboard.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import RenderMessages from './RenderMessages.js';


class MessageBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: ''
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  handleSendMessage(e) {
    if (e.key === 'Enter') {
      let room = this.props.user.room;
      let message = this.state.message;

      this.props.sendMessage(room, message)
      this.setState({ message: '' })
      document.querySelector('.newMessageInput').value = '';
    }
  }

  handleInput(e) {
    this.setState({ message: e.target.value })
  }

  render() {
    return (
      <div className="MessageBoardContainer">
        <div>
          <h1 className="roomName">{this.props.user.room}</h1>
        </div>
        <div>
          {this.props.user.messages.map(element => (
            <RenderMessages messages={element} key={Math.random()} />
          ))}
        </div>
        <div>
            <input className="newMessageInput" type="text" placeholder="Whats on your mind?"
            onChange={this.handleInput}
            onKeyPress={this.handleSendMessage}
            />
        </div>
      </div>
    )
  }
}
export default MessageBoard;


