import SimpleSchema from 'simpl-schema';

import messageBox, {isRequired} from "/imports/api/ValidationMessage";

export type Responsible = {
  _id?: string;
  firstName: string;
  lastName: string;
  urlFr: string;
  urlEn: string;
}

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

export const Responsibles = new Mongo.Collection<Responsible>('responsibles');
