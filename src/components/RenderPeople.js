import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/RenderPeople.css';
// Dynamic Component, pass in friends / people to load

const RenderPeople = ({userName, roomUsers}) => {
  return (
    <>
      {/* <div className="PeopleBox">
        <div className="Avatar"><img src="https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg"></img></div>
        <div className="Name">{userName}</div>
      </div> */}
        {roomUsers.map(element=> (
          <div className="PeopleBox" key={element.id}>
            <div className="Avatar"><img src={element.img ||'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg'}></img></div>
            <div className="Name">{element.user}</div>
          </div>
        ))}

    </>
  )
};

export default RenderPeople;