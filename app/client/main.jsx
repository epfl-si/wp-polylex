import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App';
import { Lexs, Categories, Subcategories, Authors } from '../imports/api/collections';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
});

if (Meteor.isDevelopment) {
    window.Lexs = Lexs;
    window.Categories = Categories;
    window.Subcategories = Subcategories;
    window.Authors = Authors;
    window.Users = Meteor.users;
}
