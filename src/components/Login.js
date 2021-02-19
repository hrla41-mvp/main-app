import React, { useState} from 'react'
import firebase from '../Firebase';
import { Button, Form, Container, Alert } from 'react-bootstrap';

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
    console.log(email)
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
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formBasicEmail" onChange={handleFormInput}>
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" name="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword" onChange={handleFormInput}>
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" name="password1" placeholder="Password" />
          </Form.Group>
          <a className="text-primary d-block" href="/SignUp">Don't have an account? Sign Up</a>
          <Button className="mt-3" variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
  )
}
