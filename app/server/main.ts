import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import { Roles } from "meteor/alanning:roles";
import helmet from "helmet";

// @ts-ignore
import Tequila from "meteor/epfl:accounts-tequila";

import { AppLogger } from "/imports/api/logger";
import { loadFixtures } from "./fixtures";

import "../imports/api/publications";
import "./rest-api";
import "./lex-redirect";
import "../imports/api/methods/responsibles";
import "../imports/api/methods/categories";
import "../imports/api/methods/subcategories";
import "../imports/api/methods/lexes";

Meteor.startup(() => {
  let activeTequila = true;

  // Define lang <html lang="fr" />
  WebApp.addHtmlAttributeHook(() => ({ lang: "fr" }));

  // https://guide.meteor.com/security.html#httpheaders

  WebApp.connectHandlers.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["*"],
        imgSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
      // @ts-ignore
      browserSniff: false,
    })
  );

  // https://guide.meteor.com/security.html#xframeoptions
  WebApp.connectHandlers.use(helmet.frameguard()); // defaults to sameorigin

  // Setting up logs
  new AppLogger();

  loadFixtures();

  if (activeTequila) {
    Tequila.start({
      fakeLocalServer: Meteor.settings.fake_tequila,
      service: "Polylex",
      request: ["uniqueid", "email", "group"],
      bypass: ["/api"],
      getUserId(tequila) {
        let groups = tequila.group.split(",");
        if (groups.includes("wp-polylex-admins")) {
          Roles.setUserRoles(tequila.uniqueid, ["admin"], Roles.GLOBAL_GROUP);
        } else if (groups.includes("wp-polylex-editors")) {
          Roles.setUserRoles(tequila.uniqueid, ["editor"], Roles.GLOBAL_GROUP);
        } else {
          Roles.setUserRoles(
            tequila.uniqueid,
            ["epfl-member"],
            Roles.GLOBAL_GROUP
          );
        }
        return tequila.uniqueid;
      },
      upsert: (tequila) => ({
        $set: {
          username: tequila.user,
          emails: [tequila.email],
        },
      }),
    });
  }
});
