import React, { useState } from 'react'
import { Button, Form, Container, Alert, Row, Col } from 'react-bootstrap';
import firebase from '../Firebase';
import axios from 'axios';
import '../css/SignUp.css';

export default function SignUp() {

  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cohort, setCohort] = useState('none');
  const [staff, setStaff] = useState(false);
  const [profilePic, setProfilePic] = useState('');


  function handleFormInput(e) {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password1') {
      setPassword1(e.target.value);
    } else if (e.target.name === 'password2') {
      setPassword2(e.target.value);
    } else if (e.target.name === 'firstName') {
      setFirstName(e.target.value);
    } else if (e.target.name === 'lastName') {
      setLastName(e.target.value);
    } else if (e.target.name === 'cohort') {
      setCohort(e.target.value);
    } else if (e.target.name === 'staff') {
      setStaff(e.target.checked);
      console.log(e.target.checked)
    } else if (e.target.name === 'profilePic') {
      setProfilePic(e.target.value);
    } else if (e.target.name === 'profilePic') {
      setProfilePic(e.target.value);
    } else {
      console.log(e.target.value)
    }
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
        // alert(`User created: ${userCredential.user.uid}`);
        axios.post('/slackreactor/users', {
          user_id: userCredential.user.uid,
          first_name: firstName,
          last_name: lastName,
          cohort: cohort,
          staff: false,
          friends: [],
          profile_pic: 'nothing',
          last_login: '10:00am',
          rooms: ['HEllO','ROOMID']
        })
        // add a put request to add the new user to the default rooms.

      })
      .catch((error) => {
        console.log(error)
      });
  }

  return (
    <Container className="signUpForm mt-5">
        <Form className="signupform" style={{color: '#55dc9e'}} onSubmit={handleFormSubmit}>
          {(password1 !== password2) ? <Alert variant={'danger'}>
            Passwords do not match!
          </Alert> : null }
          <Form.Group controlId="formBasicEmail" onChange={handleFormInput}>
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" name="email" placeholder="Enter email" style={{backgroundColor: '#000', color: 'white'}} />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" onChange={handleFormInput}>
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" name="password1" placeholder="Password" style={{backgroundColor: '#000', color: 'white'}}/>
          </Form.Group>
          <Form.Group controlId="formBasicPasswordConfirmation" onChange={handleFormInput}>
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control required type="password" name="password2" placeholder="Password" style={{backgroundColor: '#000', color: 'white'}} />
          </Form.Group>
          <Form.Group controlId="formBasicName" onChange={handleFormInput}>
            <Form.Label>First Name</Form.Label>
            <Form.Control required type="text" name="firstName" placeholder="Enter first name" style={{backgroundColor: '#000', color: 'white'}}/>
          </Form.Group>
          <Form.Group controlId="formBasicLastName" onChange={handleFormInput}>
            <Form.Label>Last Name</Form.Label>
            <Form.Control required type="text" name="lastName" placeholder="Enter last name" style={{backgroundColor: '#000', color: 'white'}}/>
          </Form.Group>

          <Form.Row className="align-items-center">
            <Col xs="" className="">
              <div>Cohort: </div>
              <Form.Control onChange={handleFormInput}
                name="cohort"
                as="select"
                className="mr-sm-2"
                id="inlineFormCustomSelect"
                style={{width: '125px', backgroundColor: '#000', color: 'white' }}
              >
                <option value={null}>None</option>
                <option value="HRLA41">HRLA41</option>
                <option value="HRLA40">HRLA40</option>
                <option value="HRLA39">HRLA39</option>
                <option value="HRLA38">HRLA38</option>
                <option value="HRLA37">HRLA37</option>
                <option value="HRLA36">HRLA36</option>
              </Form.Control>
            </Col>
            <Col xs="" className="">
              <div className="profilePicString">Profile Picture: </div>
              <label htmlFor="upload-photo" className="text-center uploadLabel">Browse Files</label>
              <input type="file" name="photo" id="upload-photo" onChange={handleFormInput}/>
            </Col>
            <Col xs="" className="mt-3 text-right">
              <Form.Check name="staff" onChange={handleFormInput}
                type="checkbox"
                id="customControlAutosizing"
                label="HR Staff Member?"
                custom
              />
            </Col>
          </Form.Row>
          <Form.Text className="text-muted mt-3">
              We'll never share your information with anyone else.
            </Form.Text>
          <a className="d-block mt-2 already" style={{width: '250px', color: 'white'}} href="/Login">Already have an account? Log In</a>
          <Button className="mt-3" variant="primary" type="submit" style={{backgroundColor: '#55dc9e', color: 'black', border: 'none', marginBottom: '1rem'}}>
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