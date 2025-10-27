// @ts-ignore
import Tequila from "meteor/epfl:accounts-tequila";
import React from "react";
import { Meteor } from "meteor/meteor";
import * as ReactDOMClient from 'react-dom/client';

import {
  Categories,
  Subcategories,
  Responsibles,
} from '/imports/api/collections';
import {Lexes} from "/imports/api/collections/lexes";
import App from "/imports/ui/App";


Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = ReactDOMClient.createRoot(container);
  root.render(<App />);

  Tequila.start();
});

// allow the use of the console to read some values
if (Meteor.isDevelopment) {
  const w = window as typeof window & {
    Lexes: typeof Lexes;
    Categories: typeof Categories;
    Subcategories: typeof Subcategories;
    Responsibles: typeof Responsibles;
    Users: typeof Meteor.users;
  };

  w.Lexes = Lexes;
  w.Categories = Categories;
  w.Subcategories = Subcategories;
  w.Responsibles = Responsibles;
  w.Users = Meteor.users;
}
