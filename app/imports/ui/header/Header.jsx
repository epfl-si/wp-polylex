import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Fragment } from 'react';
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
    let peopleUrl = "https://people.epfl.ch/" + props.currentUser.profile.sciper;
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
                <NavLink className="dropdown-item" exact to="/" activeClassName="active">Voir les LEX</NavLink>                                
                <NavLink className="dropdown-item" to="/add" activeClassName="active">Ajouter un nouveau lex</NavLink>
              </div>
            </li>
           
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Admin
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              
                <Fragment>
                  <NavLink className="dropdown-item" to="/admin/responsible/add" activeClassName="active">Responsables</NavLink>
                  <NavLink className="dropdown-item" to="/admin/category/add" activeClassName="active">Rubriques</NavLink>
                  <NavLink className="dropdown-item" to="/admin/subcategory/add" activeClassName="active">Sous-rubriques</NavLink>
                </Fragment>
                
              { isAdmin ?
                <Fragment>
                  <NavLink className="dropdown-item" to="/admin/log/list" activeClassName="active">Voir les logs</NavLink>
                  <NavLink className="dropdown-item" to="/admin/users" activeClassName="active">Gestion des rôles</NavLink>
                </Fragment>
                : null}
              </div>
            </li>
            
          </ul>                                  
        </div>
        : null}
        <div> Utilisateur connecté: <a target="_blank" href={ peopleUrl }> { props.currentUser.username } </a></div>
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