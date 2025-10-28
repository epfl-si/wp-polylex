import { Roles } from "meteor/roles"


export const setRolesFixtures = async () => {
  const roles = ["admin", "editor", "epfl-member"];

  for (const role of roles) {
    if (
      // @ts-ignore
      (await Meteor.roles.find({ '_id': role }).countAsync()) == 0
    ) {
      console.log(`Setting new role ${ role }`);
      Roles.createRole(role);
    }
  }
}
