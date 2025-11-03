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


class App extends Component {
  getEnvironment() {
    const absoluteUrl = Meteor.absoluteUrl();
    let environment;
    if (absoluteUrl.startsWith("http://localhost:3000/")) {
      environment = "LOCALHOST";
    } else if (
      absoluteUrl.startsWith("https://polylex-admin-test.epfl.ch/")
    ) {
      environment = "TEST";
    } else {
      environment = "PROD";
    }
    return environment;
  }
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


  render() {
    let isAdmin;
    let isEditor;
    // @ts-ignore
    let isLoading = this.props.currentUser === undefined;
    if (isLoading) {
      return <Loading />;
    } else {
      isAdmin = Meteor.userId() &&
        Roles.userIsInRole(
          Meteor.userId()!,
          "admin",
          Roles.GLOBAL_GROUP
      );
      isEditor = Meteor.userId() &&
        Roles.userIsInRole(
          Meteor.userId()!,
          "editor",
          Roles.GLOBAL_GROUP
        );
    }
export const App = () => {
  const user = useTracker(() => Accounts.user(), []);


  if (!user) return <h1>Loading...</h1>


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
