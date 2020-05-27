import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import messageBox, { isRequired } from './ValidationMessage';

export const lexesSchema = new SimpleSchema({
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
        custom: isRequired
    },
    titleEn: {
        type: String,
        label: "Titre en anglais",
        optional: false,
        custom: isRequired
    },
    urlFr: {
        type: String,
        label: "URL en français",
        optional: false,
        custom: isRequired,
        regEx: SimpleSchema.RegEx.Url,
    },
    urlEn: {
        type: String,
        label: "URL en anglais",
        optional: false,
        custom: isRequired,
        regEx: SimpleSchema.RegEx.Url,
    },    
    categoryId: {
        type: String,
        label: "Catégorie",
        optional: false,
        custom: isRequired
    },
    subcategories: {
      type: Array,
      label: "Sous-catégorie",
      optional: true
    },
    'subcategories.$': {
      type: Object,
      optional: true
    },
    'subcategories.$._id': {
      type: String,
      optional: true
    },
    'subcategories.$.nameFr': {
      type: String,
      optional: true
    },
    'subcategories.$.nameEn': {
      type: String,
      optional: true
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
    effectiveDate: {
        type: String,
        label: "Date d'entrées en vigueur",
        optional: false,
        custom: isRequired
    },
    revisionDate: {
        type: String,
        label: "Date de révision",
        optional: false,
        custom: isRequired
    },
    responsibleId: {  
        type: String,
        label: "Responsable",
        optional: false,
        custom: isRequired
    },
}, { check });

lexesSchema.messageBox = messageBox;

export const categoriesSchema = new SimpleSchema({
    // _id use to update 
    _id: {
        type: String,
        optional: true,
    },
    nameFr: {
        type: String,
        label: "Nom en français",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
    nameEn: {
        type: String,
        label: "Nom en anglais",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
});

categoriesSchema.messageBox = messageBox;

export const subcategoriesSchema = new SimpleSchema({
    // _id use to update 
    _id: {
        type: String,
        optional: true,
    },
    nameFr: {
        type: String,
        label: "Nom en français",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
    nameEn: {
        type: String,
        label: "Nom en anglais",
        optional: false,
        max: 100,
        min: 1,
        custom: isRequired
    },
});

subcategoriesSchema.messageBox = messageBox;

export const responsiblesSchema = new SimpleSchema({
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

responsiblesSchema.messageBox = messageBox;

const Lexes = new Mongo.Collection('lexes');
const Categories = new Mongo.Collection('categories');
const Subcategories = new Mongo.Collection('subcategories');
const Responsibles = new Mongo.Collection('responsibles');
const AppLogs = new Mongo.Collection('AppLogs');

// Deny all client-side updates on the Lists collection
Lexes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Categories.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Subcategories.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Responsibles.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

AppLogs.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

export {
  Lexes,
  Categories,
  Subcategories,
  Responsibles,
  AppLogs,
}
