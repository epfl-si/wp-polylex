import SimpleSchema from 'simpl-schema';

import messageBox, {isRequired} from "/imports/api/ValidationMessage";


export type Category = {
  _id?: string;
  nameFr: string;
  nameEn: string;
}

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

export type SubCategory = {
  _id?: string;
  nameFr: string;
  nameEn: string;
}


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

export const Subcategories = new Mongo.Collection<SubCategory>('subcategories');
export const Categories = new Mongo.Collection<Category>('categories');
