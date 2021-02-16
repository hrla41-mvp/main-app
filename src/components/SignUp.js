import React, { useState } from 'react'
import { Button, Form, Container, Alert } from 'react-bootstrap';
import firebase from '../Firebase';

export default function SignUp() {

  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  function handleFormInput(e) {
    console.log(e.target.name)
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password1') {
      setPassword1(e.target.value);
    } else {
      setPassword2(e.target.value);
    }
    console.log('Email: ', email);
    console.log('Password1: ', password1);
    console.log('password2: ', password2);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (password1 !== password2) {
      return alert('Passwords do not match')
    }

    // Send the log in information
    firebase.auth().createUserWithEmailAndPassword(email, password1)
      .then((userCredential) => {
        // Signed in
        alert(`User created: ${userCredential.user}`);
        // ...
      })
      .catch((error) => {
        console.log(error)
      });
  }

  return (
    <Container className="signUpForm mt-5">
        <Form onSubmit={handleFormSubmit}>
          {(password1 !== password2) ? <Alert variant={'danger'}>
            Passwords do not match!
          </Alert> : null }
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
          <Form.Group controlId="formBasicPasswordConfirmation" onChange={handleFormInput}>
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control required type="password" name="password2" placeholder="Password" />
          </Form.Group>
          <a className="text-primary d-block" href="/Login">Already have an account? Log In</a>
          <Button className="mt-3" variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
  )
}







// class component
// import React, { Component } from 'react';

// export default class SignUp extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       email: '',
//       password1: '',
//       password2: ''
//     }
//     this.handleFormInput = this.handleFormInput.bind(this);
//     this.handleFormSubmit = this.handleFormSubmit.bind(this);
//   }

//   handleFormInput(e) {
//     e.preventDefault();
//     this.setState({
//       [e.target.name]: e.target.value
//     }, () => {console.log(this.state)})

//   }

//   handleFormSubmit(e) {
//     e.preventDefault();

//     if (this.state.password1 !== this.state.password2) {
//       return alert('Passwords do not match')
//     }

//     // Send the log in information
//     firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password1)
//       .then((userCredential) => {
//         // Signed in
//         alert(`User created: ${userCredential.user}`);
//         // ...
//       })
//       .catch((error) => {
//         console.log(error)
//       });
//   }

//   render() {
//     return (
//       <Container className="signUpForm mt-5">
//         <Form onSubmit={this.handleFormSubmit}>
//           <Form.Group controlId="formBasicEmail" onChange={this.handleFormInput}>
//             <Form.Label>Email address</Form.Label>
//             <Form.Control required type="email" name="email" placeholder="Enter email" />
//             <Form.Text className="text-muted">
//               We'll never share your email with anyone else.
//             </Form.Text>
//           </Form.Group>
//           <Form.Group controlId="formBasicPassword" onChange={this.handleFormInput}>
//             <Form.Label>Password</Form.Label>
//             <Form.Control required type="password" name="password1" placeholder="Password" />
//           </Form.Group>
//           <Form.Group controlId="formBasicPasswordConfirmation" onChange={this.handleFormInput}>
//             <Form.Label>Password Confirmation</Form.Label>
//             <Form.Control required type="password" name="password2" placeholder="Password" />
//           </Form.Group>
//           <div className="text-primary">Already have an account?</div>
//           <Button className="mt-3" variant="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//       </Container>
//     )
//   }
// }
