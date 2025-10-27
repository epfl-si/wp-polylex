/// <reference path="../../../node_modules/@types/meteor-mdg-validated-method/index.d.ts" />
// have to reference the type file because the ':' in the package name. See:
// https://forums.meteor.com/t/typescript-trouble-importing-types-for-meteor-packages-in-vscode/54756
import {ValidatedMethod} from "meteor/mdg:validated-method";

import { checkUserAndRole } from "./utils";

/**
 * Cette classe a pour but de rendre obligatoire la vérification
 * du role de l'utilisateur.
 *
 * Pour cela, on ajoute à la méthode validate la vérification de l'utilisateur
 */
class PolylexValidatedMethod extends ValidatedMethod<any, any> {
  constructor(args) {
    const validateOrig = args.validate;
    args.validate = function () {
      args.role.check(this.userId, args.name);
      return validateOrig.apply(this, arguments);
    };
    super(args);
  }
}

class Admin {
  static check(userId, methodName) {
    checkUserAndRole(userId, ["admin"], `Only admins can ${methodName}`);
  }
}

class Editor {
  static check(userId, methodName) {
    checkUserAndRole(
      userId,
      ["admin", "editor"],
      `Only admins or editors can ${methodName}.`
    );
  }
}

export { Admin, Editor, PolylexValidatedMethod };
