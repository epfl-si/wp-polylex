import Tequila from "meteor/epfl:accounts-tequila";
import React from "react";
import { Meteor } from "meteor/meteor";
import * as ReactDOMClient from 'react-dom/client';
import App from "/imports/ui/App";
import {
  Lexes,
  Categories,
  Subcategories,
  Responsibles,
} from "../imports/api/collections";

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = ReactDOMClient.createRoot(container);
  root.render(<App />);

  Tequila.start();
});

if (Meteor.isDevelopment) {
  window.Lexes = Lexes;
  window.Categories = Categories;
  window.Subcategories = Subcategories;
  window.Responsibles = Responsibles;
  window.Users = Meteor.users;
}
