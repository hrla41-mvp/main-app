import React from 'react';
import '../css/RenderMessages.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

//username / avatare / message / time

// If passed in messages are from user render float right else render float left
// This module should take in a (message , avatar, user, signedin user) signinuser to be able to tell whether or not we will render to the right or left
const RenderMessages = ({ messages, fullName }) => {
  const username = messages.username;
  const profile_pic = messages.profile_pic;
  const message = messages.message;
  const time = moment(messages.time).fromNow()

  if (fullName === username) {
    return (
      <>
        <div className="mb-3 messages" style={{width: '100%'}}>
          <div className="myMessageRight">
            <div className="Avatar">
              <img className="profilePicture" src={profile_pic==='nothing'?"https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg" : profile_pic }></img><span>{username}</span>
            </div>
            <div className="myMessage">{message}</div>
            <div className="Timestamp">{time}</div>
          </div>
        </div>
      </>
    )
  } else {
  return (
    <>
      <div className="mb-3 messages" style={{width: '100%'}}>
        <div className="Avatar">
          <img className="profilePicture" src={profile_pic==='nothing'?"https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg" : profile_pic }></img><span>{username}</span>
        </div>
        <div className="Message">{message}</div>
        <div className="Timestamp">{time}</div>
      </div>
    </>
  )}
}
export default RenderMessages;