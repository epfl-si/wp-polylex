import SimpleSchema from "simpl-schema";
import { lexesSchema, Lexes } from "../collections";
import { AppLogger } from "../logger";
import { throwMeteorError } from "../error";
import { trimObjValues } from "./utils";
import { rateLimiter } from "./rate-limiting";
import { Editor, PolylexValidatedMethod } from "./roles";


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

  // Check if LEX is unique in the active ones
  let lexes = Lexes.find({ lex: lex.lex, isAbrogated: {$ne: true} });

  if (!lex.isAbrogated) {  // abrogated ones don't need such validations
    if (action === "update") {
      if (lexes.count() > 1) {
        throwMeteorError("lex", "Ce LEX existe déjà !");
      } else if (lexes.count() === 1) {
        if (lexes.fetch()[0]._id !== lex._id) {
          throwMeteorError("lex", "Ce LEX existe déjà !");
        }
      }
    } else if (action === "insert" && lexes.count() > 0) {
      throwMeteorError("lex", "Ce LEX existe déjà");
    }
  }

  // Check if LEX is format x.x.x or x.x.x.x
  var lexRE = /^\d+.\d+.\d+|\d+.\d+.\d+.\d+$/;
  if (!lex.lex.match(lexRE)) {
    throwMeteorError("lex", "Le format d'un LEX doit être x.x.x ou x.x.x.x");
  }

  // Check if responsible is empty
  if (lex.responsibleId.length === 0) {
    throwMeteorError(
      "responsibleId",
      "Vous devez sélectionner au moins 1 responsable"
    );
  }

  return lex;
}

const insertLex = new PolylexValidatedMethod({
  name: "insertLex",
  role: Editor,
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
      isAbrogated: newLex.isAbrogated,
      abrogationDate: newLex.abrogationDate,
      categoryId: newLex.categoryId,
      subcategories: newLex.subcategories,
      responsibleId: newLex.responsibleId,
    };
    lexesSchema.validate(newLexDocument);
  },
  run(newLex) {
    newLex = prepareUpdateInsertLex(newLex, "insert");
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
      isAbrogated: newLex.isAbrogated,
      abrogationDate: newLex.abrogationDate,
      categoryId: newLex.categoryId,
      subcategories: newLex.subcategories,
      responsibleId: newLex.responsibleId,
    };

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

const updateLex = new PolylexValidatedMethod({
  name: "updateLex",
  role: Editor,
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
      isAbrogated: newLex.isAbrogated,
      abrogationDate: newLex.abrogationDate,
      categoryId: newLex.categoryId,
      subcategories: newLex.subcategories,
      responsibleId: newLex.responsibleId,
    };
    lexesSchema.validate(newLexDocument);
  },
  run(newLex) {
    newLex = prepareUpdateInsertLex(newLex, "update");
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
      isAbrogated: newLex.isAbrogated,
      abrogationDate: newLex.abrogationDate,
      categoryId: newLex.categoryId,
      subcategories: newLex.subcategories,
      responsibleId: newLex.responsibleId,
    };

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

const removeLex = new PolylexValidatedMethod({
  name: "removeLex",
  role: Editor,
  validate: new SimpleSchema({
    lexId: { type: String },
  }).validator(),
  run({ lexId }) {
    let lex = Lexes.findOne({ _id: lexId });
    Lexes.remove({ _id: lexId });

    AppLogger.getLog().info(
      `Delete lex ID ${lexId}`,
      { before: lex, after: "" },
      this.userId
    );
  },
});

rateLimiter([insertLex, updateLex, removeLex]);

export { insertLex, updateLex, removeLex };
