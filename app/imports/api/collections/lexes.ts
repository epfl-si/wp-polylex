import {check} from "meteor/check";
import SimpleSchema from 'simpl-schema';

import messageBox, {isRequired} from "/imports/api/ValidationMessage";
import {EditorState} from "draft-js";

type Subcategory = {
  _id?: string;
  nameFr?: string;
  nameEn?: string;
}

export type Lex = {
  _id?: string;
  type: string
  number: string;
  titleFr: string;
  titleEn: string;
  urlFr: string;
  urlEn: string;
  urlLastConsEn?: string;
  urlLastConsFr?: string;
  categoryId: string;
  subcategories?: Subcategory[];
  descriptionFr?: string | EditorState;
  descriptionEn?: string | EditorState;
  effectiveDate: string;
  revisionDate: string;
  isAbrogated?: boolean;
  abrogationDate?: string;
  responsibleId?: string;
}


export const lexesSchema = new SimpleSchema({
  // _id use to update a lex
  _id: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
    label: "Type",
    optional: false,
    custom: isRequired
  },
  number: {
    type: String,
    label: "Numéro",
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
  urlLastConsEn: {
    type: String,
    label: "URL dernière consultation en anglais",
    optional: true,
    custom: function () {
      const url = this.value;
      if (url && url.trim() !== '') {
        if (!SimpleSchema.RegEx.Url.test(url)) {
          return 'invalidUrl';
        }
      }
    }
  },
  urlLastConsFr: {
    type: String,
    label: "URL dernière consultation en français",
    optional: true,
    custom: function () {
      const url = this.value;
      if (url && url.trim() !== '') {
        if (!SimpleSchema.RegEx.Url.test(url)) {
          return 'invalidUrl';
        }
      }
    }
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
  },
  revisionDate: {
    type: String,
    label: "Date de révision",
    optional: false,
  },
  isAbrogated: {
    type: Boolean,
    label: "Abrogé",
    optional: true,
  },
  abrogationDate: {
    type: String,
    label: "Date d'abrogation'",
    optional: true,
  },
  responsibleId: {
    type: String,
    label: "Responsable",
    optional: true,
  },
}, { check });

lexesSchema.messageBox = messageBox;

export const Lexes = new Mongo.Collection<Lex>('lexes');
