import { Lexes, Categories, Subcategories, Responsibles } from "../imports/api/collections";
import { check } from "meteor/check";

Meteor.publish('lex.list', function() {
    
    let lexCursor = Lexes.find(
        {}, 
        { sort: {lex: 1}, }
    );

    return [
        lexCursor,
    ];
});

Meteor.publish('lex.single', function(lexId) {

    console.log(`Publication lexid: ${lexId}`);
    check(lexId, String);   
    
    let lexCursor = Lexes.find({ _id: lexId });
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

Meteor.publish('responsible.list', function() {
    
    let responsibleCursor = Responsibles.find({}, {sort: {lastName:1}});
    return [
        responsibleCursor,
    ]
});

Meteor.publish('responsible.single', function(responsibleId) {

    check(responsibleId, String);

    let responsibleCursor = Responsibles.find({ _id: responsibleId });
    return [
        responsibleCursor,
    ];
});

Meteor.publish('user.list', function () { 
    return Meteor.users.find({});
});

Meteor.publish('user.roles', function () {
    return Meteor.roles.find({});
});
