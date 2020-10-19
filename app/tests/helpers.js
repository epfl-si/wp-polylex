import { loadFixtures } from "../server/fixtures";

function createUser() {
  Meteor.users.upsert(
    { username: "toto" },
    {
      // Modifier
      $set: {
        username: "toto",
        emails: ["toto.epfl.ch"],
      },
    }
  );

  let user = Meteor.users.findOne({ username: "toto" });
  let userId = user._id;

  if (Meteor.roles.find({}).count() === 0) {
    loadFixtures();
  }

  Roles.setUserRoles(userId, ["admin"], Roles.GLOBAL_GROUP);

  return userId;
}

export { createUser };
