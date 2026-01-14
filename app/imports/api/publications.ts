import {
  Types,
  Categories,
  Subcategories,
  Responsibles,
  AppLogs,
} from "./collections";
import {Lexes} from "/imports/api/collections/lexes";

if (Meteor.isServer) {
  Meteor.publish("lexes", function () {
    return Lexes.find({}, { sort: { number: 1, type: 1, abrogationDate: 1 } });
  });

  Meteor.publish("types", function () {
    return Types.find();
  });

  Meteor.publish("categories", function () {
    return Categories.find();
  });

  Meteor.publish("subcategories", function () {
    return Subcategories.find();
  });

  Meteor.publish("responsibles", function () {
    return Responsibles.find();
  });

  Meteor.publish("users", function () {
    return Meteor.users.find({});
  });

  Meteor.publish("log.list", function () {
    return AppLogs.find({});
  });

  Meteor.publish(null, function () {
    console.log("this.userId", this.userId);
    if (this.userId) {
      // @ts-ignore
      return Meteor.roleAssignment.find({ "user._id": this.userId });
    } else {
      this.ready();
    }
  });
}
