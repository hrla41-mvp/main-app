import React from 'react';
import '../css/RenderMessages.css';
import { Button, Container, Row, Col } from 'react-bootstrap';

//username / avatare / message / time

// If passed in messages are from user render float right else render float left
// This module should take in a (message , avatar, user, signedin user) signinuser to be able to tell whether or not we will render to the right or left
const RenderMessages = ({ messages }) => {
  const username = messages.username || '';
  const avatar = messages.avatar || '';
  const message = messages.message;
  const time = messages.time || '';
  return (
    <>
      <div className="mb-3 messages myMessage">
        <div className="Avatar"><img src={avatar}></img></div>
        <div className="Message">{message}</div>
      </div>
    </>
  )
}
export default RenderMessages;