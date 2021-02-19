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
      currentRoom: {},
      messages: [],
      message: '',
      roomsUsers: [],
      room: 'Bedroom',
      chatRoomsList: ['defaultRoom', 'testRoom'],
      user: 'dubz',
      username: ''
    }

    this.sendMessage = this.sendMessage.bind(this);
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
      .then((res) => {
        let user = res.data[0]
        let lastRoom = user.rooms.length - 1
        this.setState({
        user: user,
        room: user.rooms[lastRoom],
        chatRoomsList: user.rooms,
        username: `${user.first_name} ${user.last_name}`,
        userId: user.user_id
      })})
      // .then(this.getRooms())
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

  addRoom(room) {
      if (room === this.state.room) return;
      socket.emit('swapRoom', { oldRoom: this.state.room, newRoom: room, username: this.state.username, user_id: this.state.user.user_id });
      document.getElementById('typedValue').value = '';
      this.setState({ room: room, chatRoomsList: this.state.chatRoomsList.push(room)});
      axios.post('/slackreactor/rooms', {
        room_name: room,
        users:`${this.state.user.first_name} ${this.state.user.last_name}`,
      })
  }

  sendMessage (room, message) {
    let user = this.state.user;

    let chatMessage = {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_pic: user.profile_pic,
      message: message,
      timestamp: Date.now()
    }
      socket.emit('message', { room: room, message: chatMessage });
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

      socket.on('message', function (user) {
        let messageCopy = messages
        messageCopy.push({ message: user.message, avatar: user.profile_pic, username: `${user.first_name} ${user.last_name}`, timestamp: user.timestamp })
        // messageCopy.push({ message: msg, avatar: 'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg' })
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
              user={this.state.user}
            />
          </Col>
          <Col className="messageAppCol" xs={6}>
            <MessageBoard
              sendMessage={this.sendMessage}
              user={this.state}
            />
          </Col>
          <Col className="messageAppCol" >
            <FriendsList
              room={this.state.room || 'defaultRoom'}
              user={this.state.user || 'Enter a Name Here'}
              roomUsers={this.state.roomsUsers}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

