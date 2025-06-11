import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from './Logo_EPFL.svg';
import { Loading } from '../Messages';

const Header = (props) => {
  let content;
  if (props.currentUser === undefined) { 
    content = <Loading />
  } else { 
    let isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP);
    let isEditor = Roles.userIsInRole(Meteor.userId(), 'editor', Roles.GLOBAL_GROUP);
    let peopleUrl = "https://people.epfl.ch/" + props.currentUser._id;
    content =  (
      <header className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <Link className="navbar-brand" to="/"><img src={logo} className="App-logo" alt="logo"/></Link>
        { isAdmin || isEditor ?
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
          
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Polylex
              </a>
              <div className="dropdown-menu" >
                <NavLink className="{({isActive}) => (isActive ? 'active-style' : '')} dropdown-item" end to="/">Voir les lexes</NavLink>
                <NavLink className="{({isActive}) => (isActive ? 'active-style' : '')} dropdown-item" to="/add">Ajouter une nouvelle lex</NavLink>
              </div>
            </li>
           
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Admin
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              
                <>
                  <NavLink className="{({isActive}) => (isActive ? 'active-style' : '')} dropdown-item" to="/admin/responsible/add">Responsables</NavLink>
                  <NavLink className="{({isActive}) => (isActive ? 'active-style' : '')} dropdown-item" to="/admin/category/add">Rubriques</NavLink>
                  <NavLink className="{({isActive}) => (isActive ? 'active-style' : '')} dropdown-item" to="/admin/subcategory/add">Sous-rubriques</NavLink>
                </>
                
              { isAdmin ?
                <>
                  <NavLink className="{({isActive}) => (isActive ? 'active-style' : '')} dropdown-item" to="/admin/log/list">Voir les logs</NavLink>
                  <div className="dropdown-item">Polylex - version 1.14.1</div>
                </>
                : null}
              </div>
            </li>
            
          </ul>                                  
        </div>
        : null}
        <div>
          Utilisateur connecté: <a target="_blank" href={ peopleUrl }> { props.currentUser.username || props.currentUser._id } </a>
        </div>
      </header>
    )
  }
  return content;
}
export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(Header);
