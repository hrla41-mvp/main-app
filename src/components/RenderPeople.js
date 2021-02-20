import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/RenderPeople.css';
// Dynamic Component, pass in friends / people to load

const RenderPeople = ({currentRoom, usersPics}) => {
  const placeholderImg = 'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg';
  return (
    <>
        {usersPics.map(element=> (
          <div className="PeopleBox" key={Math.random()}>
            <div className="peopleInRoomAvatar">
              <img src={element.profile_pic === 'nothing' ? placeholderImg : element.profile_pic }></img>
            </div>
            <div className="peopleInRoomName">{`${element.first_name} ${element.last_name}`}</div>
          </div>
        ))}
    </>
  )
};

export default RenderPeople;