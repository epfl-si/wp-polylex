import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import messageBox, { isRequired } from './ValidationMessage';

export const lexSchema = new SimpleSchema({
    // _id use to update a lex
    _id: {
        type: String,
        optional: true,
    },
    lex: {
        type: String,
        label: "LEX",
        optional: false,
        
        custom: isRequired
    },
    title: {
        type: String,
        label: "Titre",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
    url: {
        type: String,
        label: "URL",
        optional: false,
        max: 255,
        min: 1, 
        custom: isRequired,
        regEx: SimpleSchema.RegEx.Url,
    },    
    category: {
        type: String,
        label: "Catégorie",
        optional: false,
        max: 100,
        min: 1,
    },
    subcategory: {
        type: String,
        label: "Sous-catégorie",
        optional: false,
        max: 100,
        min: 1,
    },
    description: {
        type: String,
        label: "Description",
        optional: true,
    },
    publicationDate: {
        type: String,
        label: "Date de publication",
        optional: true,
    },
    
}, { check });

lexSchema.messageBox = messageBox;

export const categoriesSchema = new SimpleSchema({
    // _id use to update 
    _id: {
        type: String,
        optional: true,
    },
    name: {
        type: String,
        label: "Nom",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
});

export const subcategoriesSchema = new SimpleSchema({
    // _id use to update 
    _id: {
        type: String,
        optional: true,
    },
    name: {
        type: String,
        label: "Nom",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
});

export const authorsSchema = new SimpleSchema({
    // _id use to update 
    _id: {
        type: String,
        optional: true,
    },
    firstName: {
        type: String,
        label: "Prénom",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
    lastName: {
        type: String,
        label: "Nom",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
    url: {
        type: String,
        label: "URL",
        optional: false,
        max: 255,
        min: 1, 
        custom: isRequired,
        regEx: SimpleSchema.RegEx.Url,
    },   
});

export const Lexs = new Mongo.Collection('lexs');
export const Categories = new Mongo.Collection('categories');
export const Subcategories = new Mongo.Collection('subcategories');
export const Authors = new Mongo.Collection('authors');
