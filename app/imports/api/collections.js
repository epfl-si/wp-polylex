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
    titleFr: {
        type: String,
        label: "Titre en français",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
    titleEn: {
        type: String,
        label: "Titre en anglais",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
    urlFr: {
        type: String,
        label: "URL en français",
        optional: false,
        max: 255,
        min: 1, 
        custom: isRequired,
        regEx: SimpleSchema.RegEx.Url,
    },
    urlEn: {
        type: String,
        label: "URL en anglais",
        optional: false,
        max: 255,
        min: 1, 
        custom: isRequired,
        regEx: SimpleSchema.RegEx.Url,
    },    
    categoryId: {
        type: String,
        label: "Catégorie",
        optional: false,
        max: 100,
        min: 1,
    },
    subcategoryId: {
        type: String,
        label: "Sous-catégorie",
        optional: false,
        max: 100,
        min: 1,
    },
    descriptionFr: {
        type: String,
        label: "Description en francais",
        optional: true,
    },
    descriptionEn: {
        type: String,
        label: "Description en anglais",
        optional: true,
    },
    publicationDateFr: {
        type: String,
        label: "Date de publication en français",
        optional: true,
    },
    publicationDateEn: {
        type: String,
        label: "Date de publication en anglais",
        optional: true,
    },
    authors: {  
        type: Array,
        label: "Auteurs",
        optional: false,
    },
    'authors.$': {
        type: Object,
        optional: false
    },
    'authors.$._id': {
        type: String,
        optional: false
    },
    'authors.$.lastName': {
        type: String,
        optional: false
    },
    'authors.$.firstName': {
        type: String,
        optional: false
    },
    'authors.$.urlFr': {
        type: String,
        optional: false
    },
    'authors.$.urlEn': {
        type: String,
        optional: false
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
    urlFr: {
        type: String,
        label: "URL",
        optional: false,
        max: 255,
        min: 1, 
        custom: isRequired,
        regEx: SimpleSchema.RegEx.Url,
    },   
    urlEn: {
        type: String,
        label: "URL",
        optional: false,
        max: 255,
        min: 1, 
        custom: isRequired,
        regEx: SimpleSchema.RegEx.Url,
    },   
});

authorsSchema.messageBox = messageBox;

export const Lexs = new Mongo.Collection('lexs');
export const Categories = new Mongo.Collection('categories');
export const Subcategories = new Mongo.Collection('subcategories');
export const Authors = new Mongo.Collection('authors');
