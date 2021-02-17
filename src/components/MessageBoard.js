import React from 'react';
import '../css/Messageboard.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import RenderMessages from './RenderMessages.js';
import io from "socket.io-client";

const SERVER = 'localhost:3000';
//create socket io connection
//then retrieve the MessagesView
const socket = io(SERVER, {
  transports: ["websocket", "polling"]
});

class MessageBoard extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: [{
        username: 'Dubeayi',
        avatar: 'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg',
        message: 'hello',
        time: 'Jan 15'
      }, {
        username: 'Vini',
        avatar: 'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg',
        message: 'what\'s  up',
        time: 'Jan 15'
      }],
      user: 'dubz',
      users: '',
      room: 'testRoom',
      // messages: [],
      message: '',
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.configureSocket = this.configureSocket.bind(this);
  }

  componentDidMount() {
    this.configureSocket();
  }

  handleInput(e) {
    this.setState({ message: e.target.value })
  }

  handleSendMessage(e) {
    e.preventDefault();
    let room = this.state.room;
    var message = this.state.message;

    socket.emit('message', { room: room, message: message });
    this.setState({ message: '' })

    //this is to clear the input field after submission. Props Antoine.
    document.querySelector('.newMessageInput').value = '';
  }

  configureSocket() {
    // let socket = socketClient(SERVER);
    let room = this.state.room;
    let user = this.state.user;
    let messages = this.state.messages
    this.setState.bind(this);
    let setter = (messageCopy) => {
      this.setState({messages: messageCopy})
    }
    setter.bind(this);
    socket.on('connect', () => {
      socket.emit('room', room);

      socket.on('message', function (msg) {
        // console.log(msg);
        let messageCopy = messages
        // console.log('messageCopy: ', messageCopy)
        console.log(messages)
        messageCopy.push({message: msg, avatar: 'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg'})
        setter(messageCopy);
      });

      socket.on('server_message', function (msg) {
        console.log(msg);
      });

      socket.emit('room', room);
      socket.emit('add_user', { name: user });
    });
  }

  render() {
    return (
      <div className="MessageBoardContainer">
        <div>
          <h1 className="roomName">Room Name Here</h1>
        </div>
        <div>
          {this.state.messages.map(element => (
            <RenderMessages messages={element} />
          ))}
        </div>
        <div>
          <form>
            <input className="newMessageInput" type="text" placeholder="Whats on your mind?" onChange={this.handleInput}></input>
            {/* <input type="submit" name="SubmitButton" onSubmit={this.handleSendMessage}></input> */}
            <button name="Submit" onClick={this.handleSendMessage}>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}
export default MessageBoard;


