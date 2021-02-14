import { Button, Form } from 'react-bootstrap';
import SignUp from './SignUp';
import MessageApp from './MessageApp';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import '../css/App.css';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 'SignUp'
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Link className="SignUpLink" to="/SignUp">SignUp</Link>
          <Link className="MessageAppLink" to="/MessageApp">MessageApp</Link>
          <Switch>
            <Route path="/" exact render={() => <SignUp />}/>
            <Route path="/SignUp" exact render={() => <SignUp />}/>
            {/* <Route path="/LogIn" exact render={() => <SignUp />}/> */}
            <Route path="/MessageApp" exact render={() => <MessageApp />}/>
          </Switch>
        </Router>
      </div>
    )
  }
}



// export default function App() {
//   let history = useHistory();
//   console.log(history);

//   function forDev() {
//     console.log(history);
//     history.push("/MessageApp");
//     console.log(history);
//   }

//   return (
//     <div className="App">
//         <Router>
//           <Switch>
//             <Route path="/" exact render={() => <SignUp />}/>
//             <Route path="/SignUp" exact render={() => <SignUp />}/>
//             {/* <Route path="/LogIn" exact render={() => <SignUp />}/> */}
//             <Route path="/MessageApp" exact render={() => <MessageApp />}/>
//           </Switch>
//         </Router>
//         {/* {(this.state.currentPage === 'SignUp') ? <SignUp /> : <MessageApp /> } */}
//         <Button className="togglePageButton" onClick={forDev} variant="dark">Toggle Page</Button>{' '}
//       </div>
//   )
// }
