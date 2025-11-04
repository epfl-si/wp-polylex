import assert from "assert";
import { Categories } from "../../collections";
import { insertCategory, updateCategory, removeCategory } from "../categories";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { createUser } from '/tests/helpers';
import { setRolesFixtures } from '/server/fixtures'

if (Meteor.isServer) {
  describe("meteor methods category", function () {
    before(async function () {
      resetDatabase();
      await setRolesFixtures();
    });

    it("insert category", async () => {
      let userId = await createUser();

      // Set up method arguments and context
      const context = { userId };
      const args = {
        nameFr: "Super nouvelle catégorie",
        nameEn: "Super new category",
      };

      insertCategory._execute(context, args);

      let nb = Categories.find({}).count();
      let category = Categories.findOne({ nameFr: "Super nouvelle catégorie" });

      assert.strictEqual(nb, 1);
      assert.strictEqual(category.nameFr, "Super nouvelle catégorie");
    });

    it("update category", async () => {
      let userId = await createUser();

      let category = Categories.findOne({ nameFr: "Super nouvelle catégorie" });

      // Set up method arguments and context
      const context = { userId };
      const args = {
        _id: category._id,
        nameFr: "Mega nouvelle catégorie",
        nameEn: "Super new category",
      };

      updateCategory._execute(context, args);

      let nb = Categories.find({}).count();
      let categoryAfterUpdate = Categories.findOne({ _id: category._id });

      assert.strictEqual(nb, 1);
      assert.strictEqual(categoryAfterUpdate.nameFr, "Mega nouvelle catégorie");
    });

    it("remove category", async () => {
      let userId = await createUser();
      let category = Categories.findOne({ nameFr: "Mega nouvelle catégorie" });

      const context = { userId };
      const args = { categoryId: category._id };

      let nbBefore = Categories.find({}).count();
      assert.strictEqual(nbBefore, 1);

      removeCategory._execute(context, args);

      let nbAfter = Categories.find({}).count();
      assert.strictEqual(nbAfter, 0);
    });
  });
}
