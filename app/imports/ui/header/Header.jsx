import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from './Logo_EPFL.svg';

class Header extends Component {

  render() {
    
    let content;

    if (this.props.currentUser !== undefined) {  
      content =  (
        <header className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
          <Link className="navbar-brand" to="/"><img src={logo} className="App-logo" alt="logo"/></Link>           
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto"> 
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Polylex
                </a>
                <div className="dropdown-menu" >
                  <NavLink className="dropdown-item" to="/">Voir les LEX</NavLink>                                
                  <NavLink className="dropdown-item" to="/add">Ajouter un nouveau lex</NavLink>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Admin
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <NavLink className="nav-link" to="/admin/responsible/add">Responsables</NavLink>
                  <NavLink className="nav-link" to="/admin/category/add">Catégories</NavLink>
                  <NavLink className="nav-link" to="/admin/subcategory/add">Sous-catégories</NavLink>
                  <NavLink className="nav-link" to="/admin/users">Gestion des rôles</NavLink>
                </div>
              </li>
            </ul>                                  
          </div>
        </header>
      )
    }
    return content;
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(Header);