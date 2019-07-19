import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import MessageBox from 'message-box';

SimpleSchema.defineValidationErrorTransform(error => {
    const ddpError = new Meteor.Error(error.message);
    ddpError.error = 'validation-error';
    ddpError.details = error.details;
    return ddpError;
});

const messageBox = new MessageBox({
    messages: {
        fr: {
          required: 'Le champ "{{label}}" est obligatoire',
          minString: 'Le champ "{{label}}" doit contenir au moins {{min}} caractères',
          maxString: 'Le champ "{{label}}" ne peut pas avoir plus de {{max}} caractères',
          minNumber: 'Le champ "{{label}}" a pour valeur minimale {{min}}',
          maxNumber: 'Le champ "{{label}}" a pour valeur maximale {{max}}',
          minNumberExclusive: 'Le champ "{{label}}" doit être plus supérieur à {{min}}',
          maxNumberExclusive: 'Le champ "{{label}}" doit être plus inférieur à {{max}}',
          minDate: 'Le champ "{{label}}" doit être le ou après le {{min}}',
          maxDate: 'Le champ "{{label}}" ne peut pas être après le {{max}}',
          badDate: 'Le champ "{{label}}" n\'est pas une date valide',
          minCount: 'Vous devez spécifier au moins {{minCount}}} valeurs',
          maxCount: 'Vous ne pouvez pas spécifier plus de {{maxCount}}} valeurs',
          noDecimal: 'Ce champ doit être un entier',
          notAllowed: 'Ce champ n\'a pas une valeur autorisée',
          expectedType: '{{label}} doit être de type {{dataType}}',
          regEx({ label, regExp }) {
            switch (regExp) {
                case (SimpleSchema.RegEx.Url.toString()):
                return "Cette URL est invalide";
            }
        },
        keyNotInSchema: '{{name}} n\'est pas autorisé par le schéma',
        },
      },
    tracker: Tracker,
  });

messageBox.setLanguage('fr');

function isRequiredUnderCondition() {    
    if (this.obj.type != 'field-of-research' && this.value === '') {
        return "required";
    }
}

function isRequired() {
    if (this.value === '') {
        return "required";
    }
}

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
        max: 100,
        min: 1,
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
    /*  
    category: {
        type: String,
        label: "Catégorie",
        optional: false,
        max: 100,
        min: 1,
    },
    subCategory: {
        type: String,
        label: "Sous-catégorie",
        optional: false,
        max: 100,
        min: 1,
    },
    */
    description: {
        type: String,
        label: "Description",
        optional: true,
    },
    publicationDate: {
        type: Date,
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
