import React from 'react';
import '../css/RenderMessages.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

//username / avatare / message / time

// If passed in messages are from user render float right else render float left
// This module should take in a (message , avatar, user, signedin user) signinuser to be able to tell whether or not we will render to the right or left
const RenderMessages = ({ messages }) => {
  const username = messages.username;
  const profile_pic = messages.profile_pic;
  const message = messages.message;
  const time = moment(messages.timestamp).fromNow()
  return (
    <>
      <div className="mb-3 messages myMessage">
        {/* <div className="Avatar"><img src={"https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg"}></img></div> */}
        <div className="Avatar"><img src={profile_pic==='nothing'?"https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg" : profile_pic }></img></div>
        <div className="Message">{message}</div>
        <div className="Username">{username}</div>
        <div className="Timestamp">{time}</div>
      </div>
    </>
  )
}
export default RenderMessages;