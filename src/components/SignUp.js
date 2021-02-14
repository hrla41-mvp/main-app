import { Button, Form, Container, Alert } from 'react-bootstrap';
import React, { Component } from 'react';
import firebase from '../Firebase';


export default class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password1: '',
      password2: ''
    }
    this.handleFormInput = this.handleFormInput.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormInput(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    }, () => {console.log(this.state)})

  }

  handleFormSubmit(e) {
    e.preventDefault();

    if (this.state.password1 !== this.state.password2) {
      return alert('Passwords do not match')
    }

    // Send the log in information
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password1)
      .then((userCredential) => {
        // Signed in
        alert(`User created: ${userCredential.user}`);
        // ...
      })
      .catch((error) => {
        console.log(error)
      });
  }

  render() {
    return (
      <Container className="signUpForm mt-5">
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Group controlId="formBasicEmail" onChange={this.handleFormInput}>
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" name="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword" onChange={this.handleFormInput}>
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" name="password1" placeholder="Password" />
          </Form.Group>
          <Form.Group controlId="formBasicPasswordConfirmation" onChange={this.handleFormInput}>
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control required type="password" name="password2" placeholder="Password" />
          </Form.Group>
          <div className="text-primary">Already have an account?</div>
          <Button className="mt-3" variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    )
  }
}
