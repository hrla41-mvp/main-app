import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/RenderRooms.css';

 // THIS COMPONENT IS TO DYNAMICALLY RENDER ROOMS USE MAP

const RenderRooms = ({ chatRoomsList, updateCurrentRoom }) => {

  const displayChatRooms = () => {
    if (chatRoomsList.length!==0) {
      return chatRoomsList.map(item => (
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

/*
    <>
      <div className="RoomsCard" >
        <div>
          <div className="RoomsName">Room Name Here</div>
        </div>
      </div>
    </>
*/