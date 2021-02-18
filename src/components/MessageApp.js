import { Button, Container, Row, Col } from 'react-bootstrap';
import React, { Component } from 'react';
import '../css/MessageApp.css';
import Chatroom from './Chatroom';
import MessageBoard from './MessageBoard';
import FriendsList from './FriendsList';
import io from "socket.io-client";
import axios from 'axios';
import firebase from '../Firebase';


const SERVER = 'localhost:3000';
const socket = io(SERVER, {
  transports: ["websocket", "polling"]
});

export default class MessageApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: this.props.userId,
      userObj: this.props.userObj,
      currentRoom: {},
      messages: [],
      message: '',
      roomsUsers: [],
      room: 'defaultRoom',
      chatRoomsList: ['defaultRoom', 'testRoom'],
      user: 'dubz'
    }

    this.handleInput = this.handleInput.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.configureSocket = this.configureSocket.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.addRoom = this.addRoom.bind(this);
    this.updateCurrentRoom = this.updateCurrentRoom.bind(this)
  }


  componentDidMount() {
    this.configureSocket();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        this.getUserInfo(uid)
      }
    });
  }

  //this function retrieves the user id from the firebase DB and loads the user's details from the DB
  getUserInfo(user) {
    axios.get(`/slackreactor/user/${user}`)
    //Set the state of User to be the user's detail object
      .then((res) => this.setState({
        user: res.data,
      }))
      .then(() => { console.log('Current user in database: ', this.state.user) })
      .then(this.getRooms())
      .catch(err => { console.log(err) })
  }

  getRooms() {
    // newArray was set to copy initial chatRoomsList
    // to temporarily help debugging
    let newArray = [...this.state.chatRoomsList];
    axios.get('/slackreactor/rooms')
      .then((response) => {
        response.data.map(item => (
          newArray.push(item.room_name)
        ))
        this.setState({
          chatRoomsList: newArray,
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  addRoom(e) {
    if (e.key === 'Enter') {
      let newRoom = document.getElementById('typedValue').value;
      // NO PUSHING ROOMS & MESSAGES TO THE DATABASE FROM THE FRONT END;
      // ALL DATABASE PUSHES MUST BE DONE FROM THE BACK END'S SOCKETS SECTION
      // PLEASE SEE WITH DUBEAYI
      // Axios.post('/slackreactor/rooms', {})
      if (newRoom === this.state.room) return;
      socket.emit('swapRoom', { oldRoom: this.state.room, newRoom: newRoom });
      document.getElementById('typedValue').value = '';
      this.setState({ room: newRoom });
    }
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

  updateCurrentRoom(e) {
    let newRoom = e.target.innerHTML;
    if (newRoom === this.state.room) return;
    socket.emit('swapRoom', { oldRoom: this.state.room, newRoom: newRoom });
    this.setState({ room: newRoom });
  }

  configureSocket() {
    let room = this.state.room;
    let user = this.state.user;
    let messages = this.state.messages
    this.setState.bind(this);
    let setter = (messageCopy) => {
      this.setState({ messages: messageCopy })
    }
    setter.bind(this);
    socket.on('connect', () => {
      socket.emit('room', { room, user });

      socket.on('message', function (msg) {
        let messageCopy = messages
        messageCopy.push({ message: msg, avatar: 'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg' })
        setter(messageCopy);
      });

      socket.on('userWelcome', ({ newUser, connectedUsersList }) => {
        this.setState({ roomsUsers: connectedUsersList });
      });

      socket.on('disconnection', (updatedList) => {
        this.setState({ roomsUsers: updatedList.connectedUsersList });
      })

    });
  }

  render() {
    return (
      <Container fluid className="messageAppContainer">
        <Row className="messageAppRow">
          <Col className="messageAppCol" >
            <Chatroom
              addRoom={this.addRoom}
              chatRoomsList={this.state.chatRoomsList}
              updateCurrentRoom={this.updateCurrentRoom}
            />
          </Col>
          <Col className="messageAppCol" xs={6}>
            <MessageBoard
              handleInput={this.handleInput}
              handleSendMessage={this.handleSendMessage}
              messages={this.state.messages}
            />
          </Col>
          <Col className="messageAppCol" >
            <FriendsList
              room={this.state.room || 'defaultRoom'}
              userName={this.state.user || 'Enter a Name Here'}
              roomUsers={this.state.roomsUsers}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

