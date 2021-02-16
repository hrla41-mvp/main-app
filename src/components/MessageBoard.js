import React from 'react';
import '../css/Messageboard.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import RenderMessages from './RenderMessages.js';

import socketClient from "socket.io-client";
const SERVER = 'localhost:8080';
//create socket io connection
//then retrieve the MessagesView


class MessageBoard extends React.Component {
  constructor() {
    super()
    this.state = {
      sampleData: [{
        username: 'Dubeayi',
        avatar: 'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg',
        message: 'hello',
        time: 'Jan 15'
      }, {
        username: 'Vini',
        avatar: 'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg',
        message: 'what\'s  up',
        time: 'Jan 15'
      }]
    }
  }

  componentDidMount() {
    this.configureSocket();
  }

  // {
  //   previous communications => GET requests
  //   sockets connection
  // }


  socket() { return }

  configureSocket() {
    let socket = socketClient(SERVER);
    socket.on('connection', msg => {
      console.log(msg);
    });
    this.socket = socket;
  }

  render() {
    return (
      <div className="MessageBoardContainer">
        <div>
          <h1 className="roomName">Room Name Here</h1>
        </div>
        <div>
          {this.state.sampleData.map(element=> (
            <RenderMessages messages={element}/>
          ))}
        </div>
        <div>
          <input className="newMessageInput" type="text" placeholder="Whats on your mind?" ></input>
        </div>
      </div>
    )
  }
}
export default MessageBoard;


