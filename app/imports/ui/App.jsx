import { BrowserRouter as Router, Route } from 'react-router-dom';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Footer from './footer/Footer';
import Header from './header/Header';
import List from './lexes/List';
import Add from './lexes/Add';
import Admin from './admin/Admin';
import User from './admin/User';

class App extends React.Component {

  render() {
    
    let isAdmin;
    
    if (this.props.currentUser === undefined) {
      return 'Loading';

    } else {
      isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP);
    }

    return (
      <Router>
        <div className="App container">
          <Header  />      
          { isAdmin ?   
            (<React.Fragment>
            <Route exact path="/" component={ List } />
            <Route exact path="/add" component={ Add } />
            <Route path="/edit/:_id" component={ Add } />
            <Route exact path="/admin" component={ Admin } />
            <Route exact path="/admin/users" component={ User } />
            
            </React.Fragment>)
           : null}
          <Footer />
        </div>
      </Router>
      )
  }
}

export default withTracker(() => {
  
  let user = Meteor.users.findOne({'_id': Meteor.userId()});
  console.log(user);
  return {  
    currentUser: user,
  };
  
})(App);

