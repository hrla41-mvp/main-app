import React from 'react';
import '../css/Chatroom.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import RenderRooms from './RenderRooms'

class Chatroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rooms: this.props.user.rooms || [],
      newRoom: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput (e) {
    this.setState({newRoom: e.target.value})
  }

  handleSubmit (e) {
    e.preventDefault;
    if (e.key === 'Enter') {
    this.props.addRoom(this.state.newRoom)
    }
  }


  render() {
    return (
      <div className="MainChatRoomContainer">
        <div className="chatRoomsList">
          <RenderRooms
            chatRoomsList={this.props.chatRoomsList}
            updateCurrentRoom={this.props.updateCurrentRoom}
            rooms={this.props.user.rooms || [] }
          />
        </div>
        <div>
          <input className="newRoomInput" id="typedValue" type="text" placeholder="Add A New Room" onChange={this.handleInput} onKeyPress={this.handleSubmit}></input>
        </div>
      </div>
    )
  }
}
export default Chatroom;