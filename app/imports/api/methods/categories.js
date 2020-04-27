import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import { categoriesSchema, Categories, Lexes } from "../collections";
import { AppLogger } from "../logger";
import { throwMeteorError } from "../error";
import { trimObjValues, checkUserAndRole } from "./utils";

function prepareUpdateInsertCategory(category, action) {
  // Trim all attributes of category
  category = trimObjValues(category);

  let categories = Categories.find({});

  // Check if nameFr category already exist (case insensitive)
  for (const currentCategory of categories) {
    if (currentCategory.nameFr.toLowerCase() == category.nameFr.toLowerCase()) {
      if (
        action == "insert" ||
        (action == "update" && currentCategory._id !== category._id)
      ) {
        throwMeteorError(
          "nameFr",
          "Nom de la rubrique en Français existe déjà !"
        );
        break;
      }
    }
  }

  // Check if nameEn category already exist (case insensitive)
  for (const currentCategory of categories) {
    if (currentCategory.nameEn.toLowerCase() == category.nameEn.toLowerCase()) {
      if (
        action == "insert" ||
        (action == "update" && currentCategory._id !== category._id)
      ) {
        throwMeteorError(
          "nameEn",
          "Nom de la rubrique en Anglais existe déjà !"
        );
        break;
      }
    }
  }

  return category;
}

const insertCategory = new ValidatedMethod({
  name: "insertCategory",
  validate: categoriesSchema.validator(),
  run(newCategory) {
    checkUserAndRole(
      this.userId,
      "Only admins or editors can insert category."
    );

    newCategory = prepareUpdateInsertCategory(newCategory, "insert");

    let newCategoryDocument = {
      nameFr: newCategory.nameFr,
      nameEn: newCategory.nameEn,
    };

    let newCategoryId = Categories.insert(newCategoryDocument);
    let newCategoryAfterInsert = Categories.findOne({ _id: newCategoryId });

    AppLogger.getLog().info(
      `Insert category ID ${newCategoryAfterInsert._id}`,
      { before: "", after: newCategoryAfterInsert },
      this.userId
    );

    return newCategoryId;
  },
});

const updateCategory = new ValidatedMethod({
  name: "updateCategory",
  validate: categoriesSchema.validator(),
  run(newCategory) {
    checkUserAndRole(
      this.userId,
      "Only admins or editors can update category."
    );

    newCategory = prepareUpdateInsertCategory(newCategory, "update");

    let newCategoryDocument = {
      nameFr: newCategory.nameFr,
      nameEn: newCategory.nameEn,
    };

    let categoryBeforeUpdate = Categories.findOne({ _id: newCategory._id });

    Categories.update({ _id: newCategory._id }, { $set: newCategoryDocument });

    let updatedCategory = Categories.findOne({ _id: newCategory._id });

    AppLogger.getLog().info(
      `Update category ID ${newCategory._id}`,
      { before: categoryBeforeUpdate, after: updatedCategory },
      this.userId
    );
  },
});

const removeCategory = new ValidatedMethod({
  name: "removeCategory",
  validate: new SimpleSchema({
    categoryId: { type: String },
  }).validator(),
  run({ categoryId }) {
    checkUserAndRole(
      this.userId,
      "Only admins or editors can remove category."
    );

    // Check if category is used
    lexesByCategory = Lexes.find({ categoryId: categoryId }).count();
    if (lexesByCategory > 0) {
      throw new Meteor.Error(
        "Remove category",
        "Cette catégorie ne peut pas être supprimée car elle est encore liée à, au moins, 1 lex."
      );
    }

    let category = Categories.findOne({ _id: categoryId });

    Categories.remove({ _id: categoryId });

    AppLogger.getLog().info(
      `Delete category ID ${categoryId}`,
      { before: category, after: "" },
      this.userId
    );
  },
});

// Get list of all method names on Todos
const TODOS_METHODS = _.pluck([
  insertCategory,
  updateCategory,
  removeCategory,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 todos operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(TODOS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}

export { insertCategory, updateCategory, removeCategory };
