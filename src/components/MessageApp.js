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

/*
    on mount, use firebase function to get firebaseid
      firebase.auth()
    query the database with the firebase id to get the specfic users obj
      this.getUserInfo(uid)
    in the user obj, there is a rooms array
    The defualt state of current room will be set to the first room
      user {
        id
        name
        rooms: ['rsa', 'auierst', 'auierst'];
      }

      --> axios request for room details.
        this.updateCurrentRoom ( this.state.user.rooms[0] );
      --> this.state.currentRoom = rooms[0] = 'testRoom'
    update current room on based on what chatroom was clicked
*/

// upon updating state, current room should be set to user.rooms[0]
//  onClick => swap currentRoom to clicked Room
// axios get request to rooms table
// retrieve all details from currentRoom
// update this.





export default class MessageApp extends Component {
  constructor(props) {
    super(props)
    this.state = {

      currentRoom: {},
      socket: {},
      messages: [],
      message: '',
      roomsUsers: [],
      room: 'Bedroom',
      chatRoomsList: ['defaultRoom', 'testRoom'],
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



  //this function retrieves the user id from the firebase DB and loads the user's details from the DB
  getUserInfo(user) {
    axios.get(`/slackreactor/user/${user}`)
    //Set the state of User to be the user's detail object
      .then((res) => {
        let user = res.data[0]
        this.setState({
        user: user,
        room: user.rooms[0],
        chatRoomsList: user.rooms,
        username: `${user.first_name} ${user.last_name}`,
        userId: user.user_id
        }), this.updateCurrentRoomOnLoad(this.state.user.rooms[0]), this.configureSocket(res.data)})
      // .then(this.getRooms())
      // .then(this.configureSocket())
      .catch(err => { console.log(err) })
  }

  updateCurrentRoomOnLoad(roomName) {
    axios.get(`/slackreactor/rooms/${roomName}`)
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
      this.state.socket.emit('swapRoom', { oldRoom: this.state.room, newRoom: room, username: this.state.username, user_id: this.state.user.user_id });
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
    console.log('its coming here')

    this.state.socket.on('connect', () => {
    console.log('its connected')

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

      this.state.socket.on('userWelcome', ({ newUser, connectedUsersList }) => {
        this.setState({ roomsUsers: connectedUsersList });
      });

      this.state.socket.on('disconnection', (updatedList) => {
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

