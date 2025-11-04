import { setRolesFixtures } from '/server/fixtures'

async function createUser() {
  await Meteor.users.upsertAsync(
    { username: "toto" },
    {
      // Modifier
      $set: {
        username: "toto",
        emails: ["toto.epfl.ch"],
      },
    }
  );

  let user = await Meteor.users.findOneAsync({ username: "toto" });
  let userId = user._id;

  await setRolesFixtures();

  await Roles.setUserRolesAsync(userId, ["admin"], Roles.GLOBAL_GROUP);

  return userId;
}

export { createUser };
