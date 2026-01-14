import SimpleSchema from 'simpl-schema';

import messageBox, {isRequired} from "/imports/api/ValidationMessage";

export type Type = {
  _id?: string;
  value: string;
}

export const typesSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
    label: "Type",
    optional: false,
    max: 100,
    min: 1,
    custom: isRequired
  },
});

typesSchema.messageBox = messageBox;

export const Types = new Mongo.Collection<Type>('types');
