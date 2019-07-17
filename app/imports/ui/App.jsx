import { BrowserRouter as Router, Route } from 'react-router-dom';
import React from 'react';
import Footer from './footer/Footer';
import Header from './header/Header';
import List from './lexs/List';

const App = () => (
    <Router>
        <div className="App container">
            <Header />
            <Route exact path="/" component={ List } />
            <Footer />
        </div>
    </Router>
);

export default App;
