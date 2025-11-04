import assert from "assert";
import { Responsibles } from "../../collections";
import {
  insertResponsible,
  updateResponsible,
  removeResponsible,
} from "../responsibles";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { createUser } from '/tests/helpers';
import { setRolesFixtures } from '/server/fixtures';

if (Meteor.isServer) {
  describe("meteor methods responsible", function () {
    before(async function () {
      resetDatabase();
      await setRolesFixtures();
    });

    it("insert responsible", async () => {
      let userId = await createUser();

      // Set up method arguments and context
      const context = { userId };
      const args = {
        firstName: "Hassan",
        lastName: "Sadeghi",
        urlFr: "https://people.epfl.ch/hr.sadeghi/?lang=fr",
        urlEn: "https://people.epfl.ch/hr.sadeghi/?lang=en",
      };

      insertResponsible._execute(context, args);

      let nb = Responsibles.find({}).count();
      let responsible = Responsibles.findOne({
        firstName: "Hassan",
        lastName: "Sadeghi",
      });

      assert.strictEqual(nb, 1);
      assert.strictEqual(responsible.firstName, "Hassan");
      assert.strictEqual(responsible.lastName, "Sadeghi");
    });

    it("update responsible", async () => {
      let userId = await createUser();

      let responsible = Responsibles.findOne({
        firstName: "Hassan",
        lastName: "Sadeghi",
      });

      // Set up method arguments and context
      const context = { userId };
      const args = {
        _id: responsible._id,
        firstName: "Roger",
        lastName: "Sadeghi",
        urlFr: "https://people.epfl.ch/hr.sadeghi",
        urlEn: "https://people.epfl.ch/hr.sadeghi",
      };

      updateResponsible._execute(context, args);

      let nb = Responsibles.find({}).count();
      let responsibleAfterUpdate = Responsibles.findOne({
        _id: responsible._id,
      });

      assert.strictEqual(nb, 1);
      assert.strictEqual(responsibleAfterUpdate.firstName, "Roger");
      assert.strictEqual(responsibleAfterUpdate.lastName, "Sadeghi");
    });

    it("remove responsible", async () => {
      let userId = await createUser();
      let responsible = Responsibles.findOne({
        firstName: "Roger",
        lastName: "Sadeghi",
      });

      const context = { userId };
      const args = { responsibleId: responsible._id };

      let nbBefore = Responsibles.find({}).count();
      assert.strictEqual(nbBefore, 1);

      removeResponsible._execute(context, args);

      let nbAfter = Responsibles.find({}).count();
      assert.strictEqual(nbAfter, 0);
    });
  });
}
