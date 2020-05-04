import SimpleSchema from "simpl-schema";
import { _ } from "meteor/underscore";
import { responsiblesSchema, Responsibles, Lexes } from "../collections";
import { AppLogger } from "../logger";
import { throwMeteorErrors } from "../error";
import { trimObjValues } from "./utils";
import { rateLimiter } from "./rate-limiting";
import { Editor, PolylexValidatedMethod } from "./roles";

function prepareUpdateInsertResponsible(responsible, action) {
  // Trim all attributes of responsible
  responsible = trimObjValues(responsible);

  let responsibles = Responsibles.find({});
  let alreadyExist = false;

  // Check if reponsible already exist (case insensitive)
  for (const currentResponsible of responsibles) {
    if (
      currentResponsible.firstName.toLowerCase() ==
        responsible.firstName.toLowerCase() &&
      currentResponsible.lastName.toLowerCase() ==
        responsible.lastName.toLowerCase()
    ) {
      if (
        action == "insert" ||
        (action == "update" && responsible._id != currentResponsible._id)
      ) {
        alreadyExist = true;
        break;
      }
    }
  }

  if (alreadyExist) {
    throwMeteorErrors(
      ["lastName", "firstName"],
      "Un responsable avec les mêmes nom et prénom existe déjà !"
    );
  }

  return responsible;
}

const insertResponsible = new PolylexValidatedMethod({
  name: "insertResponsible",
  role: Editor,
  validate: responsiblesSchema.validator(),
  run(newResponsible) {
    newResponsible = prepareUpdateInsertResponsible(newResponsible, "insert");

    let newResponsibleId = Responsibles.insert(newResponsible);
    let newResponsibleAfterInsert = Responsibles.findOne({
      _id: newResponsibleId,
    });

    AppLogger.getLog().info(
      `Insert responsible ID ${newResponsibleAfterInsert._id}`,
      { before: "", after: newResponsibleAfterInsert },
      this.userId
    );

    return newResponsibleId;
  },
});

const updateResponsible = new PolylexValidatedMethod({
  name: "updateResponsible",
  role: Editor,
  validate: responsiblesSchema.validator(),
  run(newResponsible) {
    newResponsible = prepareUpdateInsertResponsible(newResponsible, "update");

    let newResponsibleDocument = {
      firstName: newResponsible.firstName,
      lastName: newResponsible.lastName,
      urlFr: newResponsible.urlFr,
      urlEn: newResponsible.urlEn,
    };

    let responsibleBeforeUpdate = Responsibles.findOne({
      _id: newResponsible._id,
    });

    Responsibles.update(
      { _id: newResponsible._id },
      { $set: newResponsibleDocument }
    );

    let updatedResponsible = Responsibles.findOne({ _id: newResponsible._id });

    AppLogger.getLog().info(
      `Update responsible ID ${newResponsible._id}`,
      { before: responsibleBeforeUpdate, after: updatedResponsible },
      this.userId
    );
  },
});

const removeResponsible = new PolylexValidatedMethod({
  name: "removeResponsible",
  role: Editor,
  validate: new SimpleSchema({
    responsibleId: { type: String },
  }).validator(),
  run({ responsibleId }) {
    // Check if responsible is used
    lexesByResponsible = Lexes.find({ responsibleId: responsibleId }).count();
    if (lexesByResponsible > 0) {
      throw new Meteor.Error(
        "Remove responsible",
        "Ce responsable ne peut pas être supprimé car il est encore responsable d'au moins 1 lex."
      );
    }

    let responsible = Responsibles.findOne({ _id: responsibleId });

    Responsibles.remove({ _id: responsibleId });

    AppLogger.getLog().info(
      `Delete responsible ID ${responsibleId}`,
      { before: responsible, after: "" },
      this.userId
    );
  },
});

rateLimiter([insertResponsible, updateResponsible, removeResponsible]);

export { insertResponsible, updateResponsible, removeResponsible };
