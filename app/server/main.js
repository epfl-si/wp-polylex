import Tequila from "meteor/epfl:accounts-tequila";
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { importData } from './import-data';
import '../imports/api/methods';
import './publications';
import './rest-api';

// Define lang <html lang="fr" />
WebApp.addHtmlAttributeHook(() => ({ lang: 'fr' }));

Meteor.startup(() => {
  
    let needImportData = false;
    let activeTequila = true;

    if (needImportData) {
        importData();
    }

    if (activeTequila) {

      Tequila.start({
        service: 'Polylex',
        request: ['uniqueid', 'email'],
        bypass: ['/api'],
        getUserId(tequila) {
          if (tequila.uniqueid == "188475") {
            Roles.setUserRoles(tequila.uniqueid, ['editor'], Roles.GLOBAL_GROUP); 
            Roles.setUserRoles(tequila.uniqueid, ['admin'], Roles.GLOBAL_GROUP); 
          }
          // Add epfl-member by default
          if (!Roles.userIsInRole(tequila.uniqueid, ['admin', 'editor', 'epfl-member'], Roles.GLOBAL_GROUP)) {
            Roles.addUsersToRoles(tequila.uniqueid, 'epfl-member', Roles.GLOBAL_GROUP);  
          }
          return tequila.uniqueid;
        },
        upsert: (tequila) => ({ $set: {
          profile: {
            sciper: tequila.uniqueid
          },
          username: tequila.user,
          emails: [ tequila.email ],
        }}),
      });
    }
});
