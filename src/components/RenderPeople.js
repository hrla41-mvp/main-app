import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/RenderPeople.css';
// Dynamic Component, pass in friends / people to load

const RenderPeople = ({currentRoom, usersPics}) => {
  return (
    <>
        {/* {usersPics.map(element=> (
          <div className="PeopleBox" key={Math.random()}>
            <div className="Avatar">
              <img src={element.profile_pic||'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg'}></img>
            </div>
            <div className="Name">{element.username}</div>
          </div>
        ))} */}
      {currentRoom.users.map(element => (
        <div className="PeopleBox" key={Math.random()}>
          <div className="peopleInRoomAvatar">
            <img src={'https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg'}></img>
          </div>
          <div className="peopleInRoomName">{element}</div>
        </div>
      ))}
    </>
  )
};

export default RenderPeople;

// const RenderPeople = (props) => {
//   return (
//     <>

//     </>
//   )
// };