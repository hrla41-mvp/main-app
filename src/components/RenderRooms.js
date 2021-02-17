import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/RenderRooms.css';

 // THIS COMPONENT IS TO DYNAMICALLY RENDER ROOMS USE MAP

const RenderRooms = (props) => {
  return (
    <>
      {props.rooms.map(item => (
        <div className="RoomsCard" >
          <div>
            <div className="RoomsName">{item}</div>
          </div>
        </div>
      ))}
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