import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/RenderRooms.css';

 // THIS COMPONENT IS TO DYNAMICALLY RENDER ROOMS USE MAP

const RenderRooms = ({ chatRoomsList, updateCurrentRoom }) => {
  return (
    <>
      {chatRoomsList.map(roomName=> (
        <div className="RoomsCard" onClick={updateCurrentRoom}>
          <div>
            <div className="RoomsName">{roomName}</div>
          </div>
        </div>
      ))}
    </>
  )
};

export default RenderRooms;