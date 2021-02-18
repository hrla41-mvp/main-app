import React, { Component } from 'react';
import Axios from 'axios';
import { Button, Form, Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import firebase from '../Firebase';
import '../css/App.css';
import SignUp from './SignUp';
import MessageApp from './MessageApp';
import Login from './Login';
import LandingPage from './LandingPage.js'


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userIsSignedIn: false
    }
    this.logOut = this.logOut.bind(this);
  }
  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        console.log(`${user.uid} has logged in`)
        this.setState({
          userIsSignedIn: true
        })

        if (window.location.href === 'http://localhost:3000/Login' ||
        window.location.href === 'http://localhost:3000/SignUp'){
          window.location.href = "/MessageApp";
        }

      } else {
        // User is signed out
        console.log(`logged out`)
        this.setState({
          userIsSignedIn: false
        })
        if (window.location.href === 'http://localhost:3000/MessageApp') {
          window.location.href = "/";
        }
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
    const isSignedIn = this.state.userIsSignedIn;
    let dynamicHeader;

    if (isSignedIn) {
      dynamicHeader =
      <Navbar bg="dark" variant="dark" className="header-Chat-App">
        <Navbar.Brand href="/">Slack Reactor</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/MessageApp">MessageApp</Nav.Link>
        </Nav>
        <Form inline>
          <Button variant="light" onClick={this.logOut}>Log Out</Button>
        </Form>
      </Navbar>
    } else {
      dynamicHeader =
      <Navbar bg="dark" variant="dark" className="header-Chat-App">
        <Navbar.Brand href="/">Slack Reactor</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/SignUp">Sign Up</Nav.Link>
          <Nav.Link href="/Login">Log In</Nav.Link>
        </Nav>
      </Navbar>
    }


    return (
      <div className="App">
        <Router>
          <Container className="Main-Container" fluid>
            {dynamicHeader}
            <Switch>
              <Route path="/" exact render={() => <LandingPage />} />
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
/*<Nav className="mr-auto">
<Nav.Link href="/SignUp">Sign Up</Nav.Link>
<Nav.Link href="/Login">Log In</Nav.Link>
<Nav.Link href="/MessageApp">MessageApp</Nav.Link>
</Nav>



{/* { (this.state.userIsSignedIn) ?
              <Nav className="mr-auto">
                <Nav.Link href="/MessageApp">MessageApp</Nav.Link>
              </Nav> :
              <Nav className="mr-auto">
                <Nav.Link href="/SignUp">Sign Up</Nav.Link>
                <Nav.Link href="/Login">Log In</Nav.Link>
              </Nav>} }
*/


