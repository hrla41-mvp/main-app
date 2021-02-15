import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/RenderPeople.css';
// Dynamic Component, pass in friends / people to load

const RenderPeople = () => {
  return (
    <div className="PeopleBox">
      <div className="Avatar"><img src="https://shamadistrict.gov.gh/wp-content/uploads/2020/09/avatar-image.jpg"></img></div>
      <div className="Name">Hello</div>
    </div>
  )
};

export default RenderPeople;