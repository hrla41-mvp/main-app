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

export default class MessageApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentRoom: {}, // <----- MUST STAY
      socket: {}, // <------- MUST STAY HERE OR CHAT ROOM CONNECTION WILL BE LOST
      messages: [],
      message: '',
      roomsUsers: [],
      room: 'Bedroom',
      chatRoomsList: ['defaultRoom', 'testRoom'],
      userObj: {},
      user: {}, ///<----- {}
      username: ''
    }

    this.sendMessage = this.sendMessage.bind(this);
    this.configureSocket = this.configureSocket.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.addRoom = this.addRoom.bind(this);
    this.updateCurrentRoom = this.updateCurrentRoom.bind(this)
    this.updateCurrentRoomOnLoad = this.updateCurrentRoomOnLoad.bind(this)
  }
  componentDidMount() {
    // this.configureSocket();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        this.getUserInfo(uid)
      }
    });
  }

  getUserInfo(user) {
    return axios.get(`/slackreactor/user/${user}`)
    // axios request to get logged in user obj
    .then((res) => {
      let obj = res.data[0];
      //Grabs the currentRoom
      return axios.get(`/slackreactor/rooms/${obj.rooms[0]}`)
        .then((res) => {
          this.setState({
            currentRoom: res.data[0],
            userObj: obj,
            user: obj,
            room: obj.rooms[0],
            chatRoomsList: obj.rooms,
            username: `${obj.first_name} ${obj.last_name}`,
            userId: obj.user_id
          })
          console.log(obj.rooms[0]);
        })
    })
    .then(() => {
      this.configureSocket()
    })
  }

  updateCurrentRoomOnLoad(roomName) {
    return axios.get(`/slackreactor/rooms/${roomName}`)
      .then((res) => {
        let room = res.data[0];
        this.setState({ currentRoom: room });
      })
    .then(()=> {
      console.log(this.state.currentRoom)
      console.log(this.state.room);
      });
  }
  getRooms() {
    // newArray was set to copy initial chatRoomsList
    // to temporarily help debugging
    let newArray = [...this.state.chatRoomsList];
    return axios.get('/slackreactor/rooms')
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
  addRoom (requestedRoom) {
    document.getElementById('typedValue').value = '';
    if (requestedRoom === this.state.currentRoom.room_name) return;
    return axios.get(`/slackreactor/rooms/${requestedRoom}`)
    .then((res)=> {
      if (res.data.length===0){
        axios.put(`/slackreactor/addRoomToUser/${this.state.userObj.user_id}`, { rooms: requestedRoom });
        return axios.post('/slackreactor/rooms', {
          room_name: requestedRoom,
          users: `${this.state.user.first_name} ${this.state.user.last_name}`
        }).then((response) => (response.data));
      } else return res.data;
    })
    .then((data)=> {
      console.log(data);
      let details = data[0];
      let usrObjCpy = { ...this.state.userObj };
      usrObjCpy.rooms.push(data[0].room_name);
      this.setState({
        room: details.room_name,
        chatRoomsList: [...this.state.chatRoomsList, details.room_name],
        currentRoom: details,
        userObj: usrObjCpy
      });
      this.state.socket.emit('swapRoom', {
        oldRoom: this.state.currentRoom.room_name,
        newRoom: details.room_name,
        username: this.state.username,
        user_id: this.state.user.user_id
      })
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
      this.state.socket.emit('message', { room: room, message: chatMessage });
  }
  updateCurrentRoom(e) {
    let newRoom = e.target.innerHTML;
    if (newRoom === this.state.room) return;
    this.state.socket.emit('swapRoom', { oldRoom: this.state.room, newRoom: newRoom });
    this.setState({ room: newRoom });
    this.updateCurrentRoomOnLoad (newRoom);
  }
  configureSocket(data) {
    this.setState({
      socket: io(SERVER, {transports: ["websocket", "polling"]})
    })
    let room = this.state.room;
    let user = this.state.user;
    let messages = this.state.messages;
    this.setState.bind(this);
    let setter = (messageCopy) => {
      this.setState({ messages: messageCopy })
    }
    setter.bind(this);
    // console.log('its coming here')
    this.state.socket.on('connect', () => {
    // console.log('its connected')
      this.state.socket.emit('room', { room, user });
      this.state.socket.on('message', function (msg) {
        let messageCopy = messages
        messageCopy.push({
          message: msg.message,
          avatar: msg.profile_pic,
          msgname: `${msg.first_name} ${msg.last_name}`,
          timestamp: msg.timestamp
        })
        // messageCopy.push({ message: msg, avatar: 'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg' })
        setter(messageCopy);
      });
// -------------- Main event to update state for current user's in room -------------------------------------
      // this.state.socket.on('userWelcome', ({ newUser, connectedUsersList }) => {
      //   this.setState({ roomsUsers: connectedUsersList });
      // });
      // this.state.socket.on('disconnection', (updatedList) => {
      //   this.setState({ roomsUsers: updatedList.connectedUsersList });
      // })
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
              currentRoom={this.state.currentRoom || 'broken'}
              // userObj={this.state.userObj}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

