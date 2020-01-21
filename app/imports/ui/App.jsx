import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component, Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Footer from './footer/Footer';
import Header from './header/Header';
import List from './lexes/List';
import Add from './lexes/Add';
import User from './admin/User';
import Responsible from './admin/Responsible';
import Category from './admin/Category';
import Subcategory from './admin/Subcategory';
import Log from './admin/Log';
import { Loading } from './Messages';

class App extends Component {

  render() {
       
    let isAdmin;
    let isEditor;
    let isLoading = this.props.currentUser === undefined;
    if (isLoading) {
      return <Loading />;
    } else {
      isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP);
      isEditor = Roles.userIsInRole(Meteor.userId(), 'editor', Roles.GLOBAL_GROUP);
    }

    return (
      <Router>
        <div className="App container">
          <Header />
          { isAdmin || isEditor ?   
            (<Fragment>
            <Route exact path="/" component={ List } />
            <Route exact path="/add" component={ Add } />
            <Route path="/edit/:_id" component={ Add } />
            <Route path="/admin/responsible/add" component={ Responsible } />
            <Route path="/admin/responsible/:_id/edit" component={ Responsible } />
            <Route path="/admin/category/add" component={ Category } />
            <Route path="/admin/category/:_id/edit" component={ Category } />
            <Route path="/admin/subcategory/add" component={ Subcategory } />
            <Route path="/admin/subcategory/:_id/edit" component={ Subcategory } />
            </Fragment>)
           : null}
          { isAdmin ?   
            (<Fragment>
            <Route exact path="/admin/users" component={ User } />
            <Route exact path="/admin/log/list" component={ Log } />
            </Fragment>)
           : null}
          <Footer />
        </div>
      </Router>
    )
  }
}
export default withTracker(() => {
  let user = Meteor.users.findOne({'_id': Meteor.userId()});
  return {  
    currentUser: user,
  };  
})(App);
