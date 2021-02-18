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
      currentPage: 'SignUp',
      user_id: '',
      userObj: {}
    }
    this.logOut = this.logOut.bind(this);
  }
  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        console.log(`${user.uid} has logged in`)

        // this.setState({
        //   user_id: data
        // })

        Axios.get(`/slackreactor/user/${user.uid}`)
          .then(({data}) => {
            this.setState({
              userObj: data,
              user_id: user.uid
            })
          })
          .catch((err) => {
            console.log(err)
          })

        // this.setState({
        //   user_id: user.uid
        // })
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
              <Route path="/" exact render={() => <LandingPage />} />
              <Route path="/SignUp" exact render={() => <SignUp />} />
              <Route path="/Login" exact render={() => <Login />} />
              <Route path="/MessageApp" exact render={() => <MessageApp userId={this.state.user_id} userObj={this.state.userObj}/>} />
            </Switch>
          </Container>
        </Router>
      </div>
    )
  }
}
