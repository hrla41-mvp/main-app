import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/RenderRooms.css';

const RenderRooms = ({ chatRoomsList, updateCurrentRoom, rooms }) => {
  const displayChatRooms = () => {
    if (chatRoomsList.length!==0) {
      return rooms.map(item => (
        <div className="RoomsCard" key={Math.random()} onClick={updateCurrentRoom}>
          <div>
            <div className="RoomsName">{item}</div>
          </div>
        </div>
      ))
    }
  }
  return (
    <>
      {displayChatRooms()}
    </>
  )
};

export default RenderRooms;