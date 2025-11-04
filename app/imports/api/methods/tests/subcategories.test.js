import assert from "assert";
import { Subcategories } from "../../collections";
import { insertSubcategory, updateSubcategory, removeSubcategory } from "../subcategories";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { createUser } from '/tests/helpers';
import { setRolesFixtures } from '/server/fixtures'

if (Meteor.isServer) {
  describe("meteor methods subcategory", function () {
    before(async function () {
      resetDatabase();
      await setRolesFixtures();
    });

    it("insert subcategory", async () => {
      let userId = await createUser();

      // Set up method arguments and context
      const context = { userId };
      const args = {
        nameFr: "Super nouvelle sous-catégorie",
        nameEn: "Super new subcategory",
      };

      insertSubcategory._execute(context, args);

      let nb = Subcategories.find({}).count();
      let subcategory = Subcategories.findOne({ nameFr: "Super nouvelle sous-catégorie" });

      assert.strictEqual(nb, 1);
      assert.strictEqual(subcategory.nameFr, "Super nouvelle sous-catégorie");
    });

    it("update subcategory", async () => {
      let userId = await createUser();

      let subcategory = Subcategories.findOne({ nameFr: "Super nouvelle sous-catégorie" });

      // Set up method arguments and context
      const context = { userId };
      const args = {
        _id: subcategory._id,
        nameFr: "Mega nouvelle sous-catégorie",
        nameEn: "Super new subcategory",
      };

      updateSubcategory._execute(context, args);

      let nb = Subcategories.find({}).count();
      let subcategoryAfterUpdate = Subcategories.findOne({ _id: subcategory._id });

      assert.strictEqual(nb, 1);
      assert.strictEqual(subcategoryAfterUpdate.nameFr, "Mega nouvelle sous-catégorie");
    });

    it("remove subcategory", async () => {
      let userId = await createUser();
      let subcategory = Subcategories.findOne({ nameFr: "Mega nouvelle sous-catégorie" });

      const context = { userId };
      const args = { subcategoryId: subcategory._id };

      let nbBefore = Subcategories.find({}).count();
      assert.strictEqual(nbBefore, 1);

      removeSubcategory._execute(context, args);

      let nbAfter = Subcategories.find({}).count();
      assert.strictEqual(nbAfter, 0);
    });
  });
}
