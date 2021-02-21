import React, { useState} from 'react'
import firebase from '../Firebase';
import { Button, Form, Container, Alert, Row, Col } from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');

  function handleFormInput(e) {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password1') {
      setPassword1(e.target.value);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    // Send the log in information
    firebase.auth().signInWithEmailAndPassword(email, password1)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  }

  return (
    <Container className="signUpForm mt-5">
      <Form style={{ color: '#55dc9e' }} onSubmit={handleFormSubmit}>
        <Form.Group controlId="formBasicEmail" onChange={handleFormInput}>
          <Form.Label>Email address</Form.Label>
          <Form.Control required type="email" name="email" placeholder="Enter email" style={{ backgroundColor: '#000', color: 'white' }} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword" onChange={handleFormInput}>
          <Form.Label>Password</Form.Label>
          <Form.Control required type="password" name="password1" placeholder="Password" style={{ backgroundColor: '#000', color: 'white' }} />
        </Form.Group>
        <a className="d-block" href="/SignUp" style={{ width: '250px', color: 'white' }} >Don't have an account? Sign Up</a>
        <Button className="mt-3" variant="primary" type="submit" style={{ backgroundColor: '#55dc9e', color: 'black', border: 'none', marginBottom: '1rem' }}>
          Submit
          </Button>
      </Form>
      <Row>
        <Col style={{color: 'white'}}>Exploring? Please login with Credentials :
        <div className="alert alert-success mt-3" role="alert">
          <div>Email: {"<enter Credentials here>"}</div>
          <div>Password: {"<enter Credentials here>"}</div>
        </div>
            </Col>
        </Row>
      </Container>
  )
}
