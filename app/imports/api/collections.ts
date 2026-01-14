import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

import {Lexes} from "/imports/api/collections/lexes";
import { Responsibles } from "./collections/responsibles";
import { Categories, Subcategories } from "./collections/categories";
import { Types } from "./collections/types";

const AppLogs = new Mongo.Collection('AppLogs');

// Deny all client-side updates on the Lists collection
Lexes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Types.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Categories.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Subcategories.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Responsibles.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

AppLogs.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

export {
  Types,
  Categories,
  Subcategories,
  Responsibles,
  AppLogs,
}
