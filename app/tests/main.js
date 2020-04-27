import assert from "assert";
import "../imports/api/methods/tests/categories.test";
import "../imports/api/methods/tests/subcategories.test";
import "../imports/api/methods/tests/responsibles.test";
import "../imports/api/methods/tests/lexes.test";

describe("wp-polylex", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "wp-polylex");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
