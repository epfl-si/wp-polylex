import { Roles } from "meteor/alanning:roles";

export const loadRolesFixtures = () => {
  const roles = ["admin", "editor", "epfl-member"];
  roles.forEach((role) => {
    Roles.createRole(role);
  });
};

export const loadFixtures = () => {
  // @ts-ignore
  if (Meteor.roles.find({}).count() == 0) {
    console.log("Import roles");
    loadRolesFixtures();
  } else {
    console.log("Roles already exist");
  }
};
