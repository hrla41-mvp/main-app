import React from 'react';
import '../css/RenderMessages.css';
import { Button, Container, Row, Col } from 'react-bootstrap';

// If passed in messages are from user render float right else render float left
// This module should take in a (message , avatar, user, signedin user) signinuser to be able to tell whether or not we will render to the right or left
const RenderMessages = () => {
  return (
    <>
    <div className="float-right">
      <div className="Avatar"><img src="https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg"></img></div>
      <div className="Message">Hello</div>
    </div>
    <div className="float-left">
      <div className="Avatar"><img src="https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg"></img></div>
      <div className="Message">Hello there</div>
    </div>
    </>
  )
}
export default RenderMessages;