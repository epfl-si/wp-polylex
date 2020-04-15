import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from 'simpl-schema';
import { subcategoriesSchema, Subcategories, Lexes } from "../collections";
import { AppLogger } from "../logger";
import { throwMeteorError } from "../error";
import { trimObjValues } from "./utils"; 

function prepareUpdateInsertSubcategory(subcategory, action) {
  
  // Trim all attributes of subcategory
  subcategory = trimObjValues(subcategory);

  let subcategories = Subcategories.find({});

  // Check if nameFr subcategory already exist (case insensitive)
  for (const currentSubcategory of subcategories) {
    if (currentSubcategory.nameFr.toLowerCase() == subcategory.nameFr.toLowerCase()) {
      if ((action == 'insert') || (action == 'update' && currentSubcategory._id !== subcategory._id)) {
        throwMeteorError('nameFr', 'Nom de la sous-rubrique en Français existe déjà !');
        break;
      }
    }
  };

  // Check if nameEn subcategory already exist (case insensitive)
  for (const currentSubcategory of subcategories) {
    if (currentSubcategory.nameEn.toLowerCase() == subcategory.nameEn.toLowerCase()) {
      if ((action == 'insert') || (action == 'update' && currentSubcategory._id !== subcategory._id)) {
        throwMeteorError('nameEn', 'Nom de la sous-rubrique en Anglais existe déjà !');
        break;
      }
    }
  };
  
  return subcategory;
}

const insertSubcategory = new ValidatedMethod({
  name: "insertSubcategory",
  validate: subcategoriesSchema.validator(),
  run(newSubcategory) {

    checkUserAndRole(
      this.userId,
      "Only admins or editors can insert subcategory."
    );

    newSubcategory = prepareUpdateInsertSubcategory(newSubcategory, 'insert');

    let newSubcategoryDocument = {
        nameFr: newSubcategory.nameFr,
        nameEn: newSubcategory.nameEn,
    };

    let newSubcategoryId = Subcategories.insert(newSubcategoryDocument);
    let newSubcategoryAfterInsert = Subcategories.findOne({_id: newSubcategoryId});

    AppLogger.getLog().info(
      `Insert subcategory ID ${ newSubcategoryAfterInsert._id }`, 
      { before: "", after: newSubcategoryAfterInsert }, 
      this.userId
    );

    return newSubcategoryId;

  }
});

const updateSubcategory = new ValidatedMethod({
  name: "updateSubcategory",
  validate: subcategoriesSchema.validator(),
  run(newSubcategory) {

    checkUserAndRole(
      this.userId,
      "Only admins or editors can update subcategory."
    );

    newSubcategory = prepareUpdateInsertSubcategory(newSubcategory, 'update');

    let newSubcategoryDocument = {
      nameFr: newSubcategory.nameFr,
      nameEn: newSubcategory.nameEn,
    };
  
    let subcategoryBeforeUpdate = Subcategories.findOne({ _id: newSubcategory._id});

    Subcategories.update(
      { _id: newSubcategory._id }, 
      { $set: newSubcategoryDocument }
    );

    let updatedSubcategory = Subcategories.findOne({ _id: newSubcategory._id});

    AppLogger.getLog().info(
      `Update subcategory ID ${ newSubcategory._id }`, 
      { before: subcategoryBeforeUpdate , after: updatedSubcategory }, 
      this.userId
    );
    
  }
});

const removeSubcategory = new ValidatedMethod({
  name: "removeSubcategory",
  validate: new SimpleSchema({
    subcategoryId: { type: String },
  }).validator(),
  run({ subcategoryId }) {

    checkUserAndRole(
      this.userId,
      "Only admins or editors can remove subcategory."
    );

    // Check if subcategory is used
    lexesBySubcategory = Lexes.find({subcategoryId: subcategoryId}).count();
    if (lexesBySubcategory > 0) {
      throw new Meteor.Error('Remove subcategory', 'Cette sous-catégorie ne peut pas être supprimée car elle est encore liée à, au moins, 1 lex.');
    }

    Lexes.find({subcategoryId: subcategoryId}, );

    let subcategory = Subcategories.findOne({_id: subcategoryId});

    Subcategories.remove({_id: subcategoryId});

    AppLogger.getLog().info(
      `Delete subcategory ID ${ subcategoryId }`, 
      { before: subcategory, after: "" }, 
      this.userId
    );
  }
});

export {
  insertSubcategory, updateSubcategory, removeSubcategory
}
