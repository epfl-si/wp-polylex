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
    let activeTequila = false;

    if (needImportData) {
        importData();
    }

    if (activeTequila) {

        Tequila.options.request = ['uniqueid', 'email'];
    
        // In Meteor.users documents, the _id is the user's SCIPER:
        Tequila.options.getUserId = function getUserId(tequilaResponse) {
    
          Meteor.users.upsert(
            { _id: tequilaResponse.uniqueid, },
            { 
              $set: { 
                username: tequilaResponse.user,
                emails: [tequilaResponse.email], 
              }
            }
          );

          if (tequilaResponse.uniqueid == "188475") {
            Roles.setUserRoles(tequilaResponse.uniqueid, ['editor'], Roles.GLOBAL_GROUP); 
            Roles.setUserRoles(tequilaResponse.uniqueid, ['admin'], Roles.GLOBAL_GROUP); 
          }
          
          // Add epfl-member by default
          if (!Roles.userIsInRole(tequilaResponse.uniqueid, ['admin', 'editor', 'epfl-member'], Roles.GLOBAL_GROUP)) {
            Roles.addUsersToRoles(tequilaResponse.uniqueid, 'epfl-member', Roles.GLOBAL_GROUP);  
          }
          
          return tequilaResponse.uniqueid;
        }; 
    }
});
