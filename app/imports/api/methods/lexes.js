import SimpleSchema from "simpl-schema";

import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from "meteor/mdg:validated-method";

import { lexesSchema, Lexes } from "../collections";
import { AppLogger } from "../logger";
import { throwMeteorError } from "../error";
import { trimObjValues, checkUserAndRole } from "./utils";
import { rateLimiter } from "./rate-limiting";

function prepareUpdateInsertLex(lex, action) {
  // Trim all attributes of lex
  lex = trimObjValues(lex);

  // Delete "/" at the end of URL
  let urlFr = lex.urlFr;
  if (urlFr.endsWith("/")) {
    lex.urlFr = urlFr.slice(0, -1);
  }
  let urlEn = lex.urlEn;
  if (urlEn.endsWith("/")) {
    lex.urlEn = urlEn.slice(0, -1);
  }

  // Check if LEX is unique
  let lexes = Lexes.find({ lex: lex.lex });

  if (action === "update") {
    if (lexes.count() > 1) {
      throwMeteorError("lex", "Ce LEX existe déjà !");
    } else if (lexes.count() == 1) {
      if (lexes.fetch()[0]._id != lex._id) {
        throwMeteorError("lex", "Cet LEX existe déjà !");
      }
    }
  } else if (action === "insert" && lexes.count() > 0) {
    throwMeteorError("lex", "Ce LEX existe déjà");
  }

  // Check if LEX is format x.x.x or x.x.x.x
  var lexRE = /^\d+.\d+.\d+|\d+.\d+.\d+.\d+$/;
  if (!lex.lex.match(lexRE)) {
    throwMeteorError("lex", "Le format d'un LEX doit être x.x.x ou x.x.x.x");
  }

  // Check if responsible is empty
  if (lex.responsibleId.length == 0) {
    throwMeteorError(
      "responsibleId",
      "Vous devez sélectionner au moins 1 responsable"
    );
  }

  return lex;
}

const insertLex = new ValidatedMethod({
  name: "insertLex",
  validate(newLex) {
    let newLexDocument = {
      lex: newLex.lex,
      titleFr: newLex.titleFr,
      titleEn: newLex.titleEn,
      urlFr: newLex.urlFr,
      urlEn: newLex.urlEn,
      descriptionFr: newLex.jsonDescriptionFr,
      descriptionEn: newLex.jsonDescriptionEn,
      effectiveDate: newLex.effectiveDate,
      revisionDate: newLex.revisionDate,
      categoryId: newLex.categoryId,
      subcategories: newLex.subcategories,
      responsibleId: newLex.responsibleId,
    };
    lexesSchema.validate(newLexDocument);
  },
  run(newLex) {
    checkUserAndRole(this.userId, "Only admins or editors can insert LEX.");

    let newLexDocument = {
      lex: newLex.lex,
      titleFr: newLex.titleFr,
      titleEn: newLex.titleEn,
      urlFr: newLex.urlFr,
      urlEn: newLex.urlEn,
      descriptionFr: newLex.jsonDescriptionFr,
      descriptionEn: newLex.jsonDescriptionEn,
      effectiveDate: newLex.effectiveDate,
      revisionDate: newLex.revisionDate,
      categoryId: newLex.categoryId,
      subcategories: newLex.subcategories,
      responsibleId: newLex.responsibleId,
    };

    newLex = prepareUpdateInsertLex(newLexDocument, "insert");

    let newLexId = Lexes.insert(newLexDocument);
    let newLexAfterInsert = Lexes.findOne({ _id: newLexId });

    AppLogger.getLog().info(
      `Insert lex ID ${newLexId}`,
      { before: "", after: newLexAfterInsert },
      this.userId
    );

    return newLexAfterInsert;
  },
});

const updateLex = new ValidatedMethod({
  name: "updateLex",
  validate(newLex) {
    let newLexDocument = {
      _id: newLex._id,
      lex: newLex.lex,
      titleFr: newLex.titleFr,
      titleEn: newLex.titleEn,
      urlFr: newLex.urlFr,
      urlEn: newLex.urlEn,
      descriptionFr: newLex.jsonDescriptionFr,
      descriptionEn: newLex.jsonDescriptionEn,
      effectiveDate: newLex.effectiveDate,
      revisionDate: newLex.revisionDate,
      categoryId: newLex.categoryId,
      subcategories: newLex.subcategories,
      responsibleId: newLex.responsibleId,
    };
    lexesSchema.validate(newLexDocument);
  },
  run(newLex) {
    checkUserAndRole(this.userId, "Only admins or editors can update LEX.");

    let newLexDocument = {
      _id: newLex._id,
      lex: newLex.lex,
      titleFr: newLex.titleFr,
      titleEn: newLex.titleEn,
      urlFr: newLex.urlFr,
      urlEn: newLex.urlEn,
      descriptionFr: newLex.jsonDescriptionFr,
      descriptionEn: newLex.jsonDescriptionEn,
      effectiveDate: newLex.effectiveDate,
      revisionDate: newLex.revisionDate,
      categoryId: newLex.categoryId,
      subcategories: newLex.subcategories,
      responsibleId: newLex.responsibleId,
    };

    newLex = prepareUpdateInsertLex(newLexDocument, "update");

    let lexBeforeUpdate = Lexes.findOne({ _id: newLex._id });

    Lexes.update({ _id: newLex._id }, { $set: newLexDocument });

    let updatedLex = Lexes.findOne({ _id: newLex._id });

    AppLogger.getLog().info(
      `Update lex ID ${newLex._id}`,
      { before: lexBeforeUpdate, after: updatedLex },
      this.userId
    );

    return newLex._id;
  },
});

const removeLex = new ValidatedMethod({
  name: "removeLex",
  validate: new SimpleSchema({
    lexId: { type: String },
  }).validator(),
  run({ lexId }) {
    checkUserAndRole(this.userId, "Only admins or editors can remove LEX.");
    let lex = Lexes.findOne({ _id: lexId });
    Lexes.remove({ _id: lexId });

    AppLogger.getLog().info(
      `Delete lex ID ${lexId}`,
      { before: lex, after: "" },
      this.userId
    );
  },
});

// Get list of all method names on Todos
const TODOS_METHODS = _.pluck([
  insertLex,
  updateLex,
  removeLex,
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

rateLimiter([insertLex, updateLex, removeLex]);

export { insertLex, updateLex, removeLex };
