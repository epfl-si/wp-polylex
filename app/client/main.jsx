import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App';
import { Lexs } from '../imports/api/collections';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
});

if (Meteor.isDevelopment) {
    window.Lexs = Lexs;
}
