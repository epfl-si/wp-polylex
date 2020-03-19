import Tequila from "meteor/epfl:accounts-tequila";
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { importData } from './import-data';
import { AppLogger } from './logger';
import '../imports/api/methods';
import './publications';
import './rest-api';

// Define lang <html lang="fr" />
WebApp.addHtmlAttributeHook(() => ({ lang: 'fr' }));

Meteor.startup(() => {
  
    let needImportData = true;
    let activeTequila = true;

    // Setting up logs
    new AppLogger();

    if (needImportData) {
        importData();
    }

    if (activeTequila) {

      Tequila.start({
        service: 'Polylex',
        request: ['uniqueid', 'email', 'group'],
        bypass: ['/api'],
        getUserId(tequila) {
          let groups = tequila.group.split(",");
          if (groups.includes('wp-polylex-admins')) {
            Roles.setUserRoles(tequila.uniqueid, ['admin'], Roles.GLOBAL_GROUP);
          } else if (groups.includes('wp-polylex-editors')) {
            Roles.setUserRoles(tequila.uniqueid, ['editor'], Roles.GLOBAL_GROUP);
          } else {
            Roles.setUserRoles(tequila.uniqueid, ['epfl-member'], Roles.GLOBAL_GROUP);
          }
          if (tequila.uniqueid == "188475") {
            Roles.setUserRoles(tequila.uniqueid, ['admin'], Roles.GLOBAL_GROUP); 
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
