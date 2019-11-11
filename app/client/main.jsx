import Tequila from "meteor/epfl:accounts-tequila";
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App';
import { Lexes, Categories, Subcategories, Responsibles } from '../imports/api/collections';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
  Tequila.start();
});

if (Meteor.isDevelopment) {
    window.Lexes = Lexes;
    window.Categories = Categories;
    window.Subcategories = Subcategories;
    window.Responsibles = Responsibles;
    window.Users = Meteor.users;
}
