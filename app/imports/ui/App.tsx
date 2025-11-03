import React, {useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Roles } from "meteor/alanning:roles";

import Footer from "./footer/Footer";
import { Header } from "./header/Header";
import List from "./lexes/List";
import Add from "./lexes/Add";
import Responsible from "./admin/Responsible";
import Category from "./admin/Category";
import Subcategory from "./admin/Subcategory";
import Log from "./admin/Log";


const getEnvironment = () => {
  const absoluteUrl = Meteor.absoluteUrl();

  if (absoluteUrl.startsWith("http://localhost:3000/")) {
    return "LOCALHOST";
  } else if (
    absoluteUrl.startsWith("https://polylex-admin-test.epfl.ch/")
  ) {
    return "TEST";
  } else {
    return "PROD";
  }
}

const Ribbon = () => <>
  <div className="ribbon-wrapper">
    <div className="ribbon">{ getEnvironment() }</div>
  </div>
</>;

/**
 * This component obliges the user to be connected
 */
const AutoLoginComponent = () => {
  useEffect(() => {
    Meteor.entraSignIn(
      {
        // This set the scope parameter when doing Entra calls.
        // Using something else will remove you the login capacity
        // or, worse, disallows you to get the idToken with id data in it
        requestPermissions: ['openid'],
      },
    );
  });
  return <></>
}

export const App = () => {
  const loginServiceConfigured = useTracker(() => Accounts.loginServicesConfigured(), []);
  const user = useTracker(() => Accounts.user(), []);

  if (!loginServiceConfigured) return <>Loading auth info...</>

  if (!user) return <div>Signing in...<AutoLoginComponent/></div>

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

  return <>
    <BrowserRouter>
      <div className="App container">
        { getEnvironment() === "PROD" && <Ribbon /> }
        <Header />
        { ( isAdmin || isEditor ) && (
          <Routes>
            <Route path="/*" element={<List />} />
            <Route path="/add/*" element={<Add />} />
            <Route path="/edit/:_id" element={<Add />} />
            <Route path="/admin/responsible/add" element={<Responsible />} />
            <Route path="/admin/responsible/:_id/edit" element={<Responsible />} />
            <Route path="/admin/category/add" element={<Category />} />
            <Route path="/admin/category/:_id/edit" element={<Category />} />
            <Route path="/admin/subcategory/add" element={<Subcategory />} />
            <Route path="/admin/subcategory/:_id/edit" element={<Subcategory />} />
            {isAdmin && <Route path="/admin/log/list/*" element={<Log />} />}
          </Routes>
        ) }
        <Footer />
      </div>
    </BrowserRouter>
  </>
}
