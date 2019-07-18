import { BrowserRouter as Router, Route } from 'react-router-dom';
import React from 'react';
import Footer from './footer/Footer';
import Header from './header/Header';
import List from './lexs/List';
import Add from './lexs/Add';
import Admin from './admin/Admin';
import User from './admin/User';

const App = () => (
    <Router>
        <div className="App container">
            <Header />
            <Route exact path="/" component={ List } />
            <Route exact path="/add" component={ Add } />
            <Route path="/edit/:_id" component={ Add } />
            <Route exact path="/admin" component={ Admin } />
            <Route exact path="/admin/users" component={ User } />
            <Footer />
        </div>
    </Router>
);

export default App;
