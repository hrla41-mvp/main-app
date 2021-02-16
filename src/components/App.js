import React, { Component } from 'react';
import { Button, Form, Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import firebase from '../Firebase';
import '../css/App.css';
import SignUp from './SignUp';
import MessageApp from './MessageApp';
import Login from './Login';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 'SignUp'
    }
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log(`${user.uid} has logged in`)
      } else {
        // User is signed out
        // ...
        console.log(`logged out`)
      }
    });
  }

  logOut() {
    firebase.auth().signOut()
      .then(() => {
      // Sign-out successful.
      console.log('Sign-out successful')
    }).catch((error) => {
      // An error happened.
    });
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Container className="Main-Container" fluid>
            <Navbar bg="dark" variant="dark" className="header-Chat-App">
              <Navbar.Brand href="#home">Slack Reactor</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="/SignUp">Sign Up</Nav.Link>
                <Nav.Link href="/Login">Log In</Nav.Link>
                <Nav.Link href="/MessageApp">MessageApp</Nav.Link>
              </Nav>
              <Form inline>
                <Button variant="outline-info" onClick={this.logOut}>Log Out</Button>
              </Form>
            </Navbar>
            <Switch>
              <Route path="/" exact render={() => <SignUp />} />
              <Route path="/SignUp" exact render={() => <SignUp />} />
              <Route path="/Login" exact render={() => <Login />} />
              <Route path="/MessageApp" exact render={() => <MessageApp />} />
            </Switch>
          </Container>
        </Router>
      </div>
    )
  }
}
