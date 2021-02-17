import { Button, Container, Row, Col } from 'react-bootstrap';
import React, { Component } from 'react';
import '../css/MessageApp.css';
import Chatroom from './Chatroom';
import MessageBoard from './MessageBoard';
import FriendsList from './FriendsList';
import io from "socket.io-client";

const SERVER = 'localhost:3000';
const socket = io(SERVER, {
  transports: ["websocket", "polling"]
});

export default class MessageApp extends Component {
  constructor(props) {
    super(props)
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
      id: '',
      status: 'online',
      users: '',
      room: 6,
      message: '',
      friendsList: '',
      roomUsers: [
        {
          user: 'Greg',
          status: 'offline',
          id: '1'
        },
        {
          user: 'Dubeayi',
          status: 'offline',
          id: '2'
        }
      ],
      user_id: 'ABCDEFGHIJ',
      first_name: 'Vini',
      profile_pic: 'http://www.google.com/',
      post: 'Hello, this is me'
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

    document.querySelector('.newMessageInput').value = '';
  }

  configureSocket() {
    let room = this.state.room;
    let user = this.state.user;
    let messages = this.state.messages
    this.setState.bind(this);
    //this lexical-scoped function is used to set the state of messages to include the new message
    let setter = (messageCopy) => {
      this.setState({ messages: messageCopy })
    }
    setter.bind(this);
    socket.on('connect', () => {
      socket.emit('room', {room, user});

      socket.on('message', function (msg) {
        let messageCopy = messages
        messageCopy.push({ message: msg, avatar: 'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg' })
        setter(messageCopy);
      });

      socket.on('userWelcome', ({ newUser, connectedUsersList})=> {
        console.log('user joined the room');
        let update = [...this.state.roomUsers];
        update.push(newUser)
        for (var j=0; j<connectedUsersList.length; j++) {
          let isInList = false;
          for (var i=0; i < update.length; i++) {
            let updateUser = update[i];
            let conUser = connectedUsersList[j]
            /* this extra check is meant to avoid any conflicts with duplicate usernames*/
            if (updateUser.user===conUser.user && updateUser.id === conUser.id) {
              if (update[i].status===undefined) update[i]['status']='';
              update[i].status = 'online';
              isInList = true;
            }
          }
          if (!isInList) update.push(connectedUsersList[j]);
        }
        this.setState({roomUsers: update});
      });

      socket.on('disconnection', (user)=> {
        console.log('user left the room');
        // find user with matching id, update status
        let update = [...this.state.roomUsers];
        for (var i = 0; i < update.length; i++) {
          if (update[i].user === user.user && update[i].id === user.id) {
            update.splice(i, 1);
          }
        }
        this.setState({ roomUsers: update });
      })

    });
  }

  render() {
    return (
      <Container fluid className="messageAppContainer">
        <Row className="messageAppRow">
          <Col className="messageAppCol" > <Chatroom /> </Col>
          <Col className="messageAppCol" xs={6}> <MessageBoard
            handleInput={this.handleInput}
            handleSendMessage={this.handleSendMessage}
            messages={this.state.messages}
          /> </Col>
          <Col className="messageAppCol" > <FriendsList
            room={this.state.room || 'default room'}
            user={this.state.user || 'Enter a Name Here'}
            roomUsers={this.state.roomUsers}
          /> </Col>
        </Row>
      </Container>
    )
  }
}

