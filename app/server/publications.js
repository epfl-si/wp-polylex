import { Lexes, Categories, Subcategories, Responsibles, AppLogs } from "../imports/api/collections";

Meteor.publish('lexes', function() {  
  return Lexes.find();
});

Meteor.publish('categories', function() {
  return Categories.find();
});

Meteor.publish('subcategories', function() {
  return Subcategories.find();
});

Meteor.publish('responsibles', function () {
  return Responsibles.find();    
})

Meteor.publish('users', function () { 
    return Meteor.users.find({});
});

Meteor.publish('user.roles', function () {
    return Meteor.roles.find({});
});

Meteor.publish('log.list', function() {    
  return AppLogs.find({});
});