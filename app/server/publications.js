import { Lexs, Categories, Subcategories, Authors } from "../imports/api/collections";
import { check } from "meteor/check";

Meteor.publish('lex.list', function() {
    
    let lexCursor = Lexs.find(
        {}, 
        { sort: {lex: 1}, }
    );

    return [
        lexCursor,
    ];
});

Meteor.publish('lex.single', function(lexId) {

    check(lexId, String);
    
    let lexCursor = Lexs.find({ _id: lexId });
    return [
        lexCursor,
    ];
});

Meteor.publish('category.list', function() {
    
    let categoryCursor = Categories.find({}, {sort: {name:1}});
    return [
        categoryCursor,
    ]
});

Meteor.publish('subcategory.list', function() {
    
    let subcategoryCursor = Subcategories.find({}, {sort: {name:1}});
    return [
        subcategoryCursor,
    ]
});

Meteor.publish('author.list', function() {
    
    let authorCursor = Authors.find({}, {sort: {name:1}});
    return [
        authorCursor,
    ]
});

Meteor.publish('user.list', function () { 
    return Meteor.users.find({});
});

Meteor.publish('user.roles', function () {
    return Meteor.roles.find({});
});
