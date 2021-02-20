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
      profilePics: [],
      room: 'Bedroom',
      chatRoomsList: ['defaultRoom', 'testRoom'],
      userObj: {},
      user: {}, ///<----- {}
      username: '',
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
      //  Grab currentRoom
      // Grab messages from room
      // grab users from room
      return axios.get(`/slackreactor/rooms/${obj.rooms[0]}`)
        .then((res) => {
          return axios.get(`/slackreactor/roomUsers/${res.data[0].room_name}`)
          .then((response) => {
            let { messagesList } = this.extractMessages(res.data);
            this.setState({
              currentRoom: res.data[0],
              userObj: obj,
              user: obj,
              room: obj.rooms[0],
              chatRoomsList: obj.rooms,
              username: `${obj.first_name} ${obj.last_name}`,
              userId: obj.user_id,
              messages: messagesList,
              profilePics: response.data
            })
          })
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

  extractMessages(data) {
    var reggir = /^\{user_id:\s(.*),\sfirst_name:\s(.*),\slast_name:\s(.*),\sprofile_pic:\s(.*),\smessage:\s(.*),\stimestamp:\s(.*)\}$/;
    let messagesList = [];
    let usersPics = [];
    let usersNames = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].messages.length === 0) continue;
      for (let j = 0; j < data[i].messages.length; j++) {
        //{username, pictures}
        const match = data[i].messages[j].match(reggir);
        if (!match || match.length === 0) continue;
        if (!usersNames.includes(`${match[2]} ${match[3]}`)) {
          usersPics.push({
            username: `${match[2]} ${match[3]}`,
            profile_pic: `${match[5]}`
          })
          usersNames.push(`${match[2]} ${match[3]}`);
        }
        messagesList.push({
          username: `${match[2]} ${match[3]}`,
          profile_pic: `${match[4]}`,
          message: `${match[5]}`,
          time: `${match[6]}`
        });
        // TBNoted: SENDERS & TIMESTAMPS CAN BE FOUND IN THE MATCH ARRAY
        // PLEASE USE FOR DISPLAYING MESSAGE SENDERS
      }
    }
    return { messagesList, usersPics };
  }
  addRoom (requestedRoom) {
    document.getElementById('typedValue').value = '';
    // if the room doesn't exist => create room, add user to room, add room to user
    // if the room does exist but doesn't include current user => add him.
    // if the room does exist && includes current user=> load everything
    if (requestedRoom === this.state.currentRoom.room_name) return;
    return axios.get(`/slackreactor/rooms/${requestedRoom}`)
    .then((res)=> {
      if (res.data.length===0){
        /// add room to user
        axios.put(`/slackreactor/addRoomToUser/${this.state.userObj.user_id}`, { rooms: requestedRoom });
        return axios.post('/slackreactor/rooms', {
          room_name: requestedRoom,
          users: `${this.state.user.first_name} ${this.state.user.last_name}`
        }).then((response) => (response.data));
      } else if (!res.data[0].users.includes(this.state.username)) {
        // add uset to room
        return axios.put(`/slackreactor/addUserToRoom/${requestedRoom}`, {
          username: `${this.state.user.first_name} ${this.state.user.last_name}`
        }).then((response)=> (response.data.rows));
      } else return res.data;
    })
    .then((data)=> {
      return axios.get(`/slackreactor/roomUsers/${data[0].room_name}`)
      .then((response)=> {
        let details = data[0];
        let usrObjCpy = { ...this.state.userObj };
        usrObjCpy.rooms.push(details.room_name);
        const { messagesList } = this.extractMessages([details]);
        this.setState({
          currentRoom: details,
          room: details.room_name,
          userObj: usrObjCpy,
          roomsUsers: data[0].users,
          messages: messagesList,
          profilePics: response.data,
          chatRoomsList: [...this.state.chatRoomsList, details.room_name],
        });
        this.state.socket.emit('swapRoom', {
          oldRoom: this.state.currentRoom.room_name,
          newRoom: details.room_name,
          username: this.state.username,
          user_id: this.state.user.user_id
        })
      })
    })
  }

  sendMessage (room, message) {
    let userObj = this.state.userObj;
    let chatMessage = {
      user_id: userObj.user_id,
      first_name: userObj.first_name,
      last_name: userObj.last_name,
      username: `${userObj.first_name} ${userObj.last_name}`,
      profile_pic: userObj.profile_pic,
      message: message,
      time: Date.now()
    }
      this.state.socket.emit('message', { room: room, message: chatMessage });
  }
  updateCurrentRoom(e) {
    let newRoom = e.target.innerHTML;
    if (newRoom === this.state.room) return;
    return axios.get(`/slackreactor/rooms/${newRoom}`).then(res => res.data)
      .then((data) => {
        return axios.get(`/slackreactor/roomUsers/${data[0].room_name}`)
          .then((response) => {
            const { messagesList } = this.extractMessages(data);
            console.log('data from update :', data);
            console.log('messageslist: ', messagesList);
            this.setState({
              currentRoom: data[0],
              room: data[0].room_name,
              roomsUsers: data[0].users,
              messages: messagesList,
              profilePics: response.data,
            });
            this.state.socket.emit('swapRoom', {
              oldRoom: this.state.room,
              newRoom: data[0].room_name
            });
          })
      })
      .catch(err => console.log(err));
  }
  configureSocket(data) {
    this.setState({
      socket: io(SERVER, {transports: ["websocket", "polling"]})
    })
    let room = () => this.state.room;
    let user = () => this.state.user;
    let messages = () => this.state.messages;
    this.setState.bind(this);
    let setter = (messageCopy) => {
      this.setState({ messages: messageCopy })
    }
    setter.bind(this);
    this.state.socket.on('connect', () => {
      this.state.socket.emit('room', { room: room(), user: user() });
      this.state.socket.on('message', (msg) => {
        let messageCopy = [...messages()];
        messageCopy.push({
          message: msg.message,
          profile_pic: msg.profile_pic,
          username: `${msg.username}`,
          first_name: msg.first_name,
          last_name: msg.last_name,
          time: msg.time,
          user_id: msg.user_id
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
          <Col className="messageAppColBorder" xs={8}>
            <MessageBoard
              sendMessage={this.sendMessage}
              user={this.state}
            />
          </Col>
          <Col className="messageAppCol" >
            <FriendsList
              currentRoom={this.state.currentRoom || 'broken'}
              // userObj={this.state.userObj}
              profilePics={this.state.profilePics}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

