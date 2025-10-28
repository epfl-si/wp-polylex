import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Roles } from "meteor/roles"
import { useTracker } from 'meteor/react-meteor-data';
import logo from './Logo_EPFL.svg';
import { Loading } from '../Messages';
import packageJson from '/package.json'

export const Header = () => {
  const user = useTracker(() => Accounts.user(), []);

  if (!user) return <Loading />

  const isAdmin = Roles.userIsInRole(
    user._id,
    "admin",
    Roles.GLOBAL_GROUP
  ) ?? false

  const isEditor = Roles.userIsInRole(
    user._id,
    "editor",
    Roles.GLOBAL_GROUP
  ) ?? false

  const peopleUrl = "https://people.epfl.ch/" + user._id;

  return <>
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
                    <div className="dropdown-item">Polylex - version { packageJson.version }</div>
                  </>
                  : null}
              </div>
            </li>

          </ul>
        </div>
        : null}
      <div>
        Utilisateur connecté: <a target="_blank" href={ peopleUrl }> { user.services?.entra?.gaspar || user._id } </a>
      </div>
    </header>
  </>
}
