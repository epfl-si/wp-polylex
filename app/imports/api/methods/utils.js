function trimObjValues(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key].hasOwnProperty('trim')) {
      obj[key] = obj[key].trim();
    }
  });
  return obj;
}

const checkUserAndRole = (userId, roles, msg) => {
  if (!userId) {
    throw new Meteor.Error("not connected");
  }

  const canDoAction = Roles.userIsInRole(userId, roles, Roles.GLOBAL_GROUP);

  if (!canDoAction) {
    throw new Meteor.Error("unauthorized", msg);
  }
};

export { trimObjValues, checkUserAndRole };
