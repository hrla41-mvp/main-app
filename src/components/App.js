import { Button, Form } from 'react-bootstrap';
import SignUp from './SignUp';
import MessageApp from './MessageApp';
import React, { Component } from 'react';
import '../css/App.css'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 'SignUp'
    }
    this.forDev = this.forDev.bind(this);

  }

  forDev () {
    if (this.state.currentPage === 'SignUp') {
      this.setState({
        currentPage: 'MessageApp'
      })
    } else {
      this.setState({
        currentPage: 'SignUp'
      })
    }
  }

  render() {
    return (
      <div className="App">
        {(this.state.currentPage === 'SignUp') ? <SignUp /> : <MessageApp /> }
        <Button className="togglePageButton" onClick={this.forDev} variant="dark">Toggle Page</Button>{' '}
      </div>
    )
  }
}

