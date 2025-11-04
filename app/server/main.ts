import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import helmet from "helmet";

import { AppLogger } from "/imports/api/logger";
import { loadFixtures } from "./fixtures";
import { setEntraAuthConfig } from "/server/entraAuth";

import "../imports/api/publications";
import "./rest-api";
import "./lex-redirect";
import "../imports/api/methods/responsibles";
import "../imports/api/methods/categories";
import "../imports/api/methods/subcategories";
import "../imports/api/methods/lexes";


Meteor.startup(async () => {
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

  await setEntraAuthConfig();
});
