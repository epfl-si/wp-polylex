import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import List from "./lexes/List";
import Add from "./lexes/Add";
import Responsible from "./admin/Responsible";
import Category from "./admin/Category";
import Subcategory from "./admin/Subcategory";
import Log from "./admin/Log";
import { Loading } from "./Messages";

class App extends Component {
  getEnvironment() {
    const absoluteUrl = Meteor.absoluteUrl();
    let environment;
    if (absoluteUrl.startsWith("http://localhost:3000/")) {
      environment = "LOCALHOST";
    } else if (
      absoluteUrl.startsWith("https://polylex.128.178.222.83.nip.io/")
    ) {
      environment = "TEST";
    } else {
      environment = "PROD";
    }
    return environment;
  }

  render() {
    let isAdmin;
    let isEditor;
    let isLoading = this.props.currentUser === undefined;
    if (isLoading) {
      return <Loading />;
    } else {
      isAdmin = Roles.userIsInRole(
        Meteor.userId(),
        "admin",
        Roles.GLOBAL_GROUP
      );
      isEditor = Roles.userIsInRole(
        Meteor.userId(),
        "editor",
        Roles.GLOBAL_GROUP
      );
    }

    const ribbon = (
      <div className="ribbon-wrapper">
        <div className="ribbon">{this.getEnvironment()}</div>
      </div>
    );

    return (
      <BrowserRouter>
        <div className="App container">
          {this.getEnvironment() === "PROD" ? null : ribbon}
          <Header />
          {isAdmin || isEditor ? (
              <Routes>
                <Route path="/*" element={<List />} />
                <Route path="/add/*" element={<Add />} />
                <Route path="/edit/:_id" element={<Add />} />
                <Route path="/admin/responsible/add" element={<Responsible />} />
                <Route path="/admin/responsible/:_id/edit" element={<Responsible />} />
                <Route path="/admin/category/add" element={<Category />} />
                <Route path="/admin/category/:_id/edit" element={<Category />} />
                <Route path="/admin/subcategory/add" element={<Subcategory />} />
                <Route
                  path="/admin/subcategory/:_id/edit"
                  element={<Subcategory />}
                />
                {isAdmin && <Route path="/admin/log/list/*" element={<Log />} />}
              </Routes>
          ) : null}
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}
export default withTracker(() => {
  let user = Meteor.users.findOne({ _id: Meteor.userId() });
  return {
    currentUser: user,
  };
})(App);
