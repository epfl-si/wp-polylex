import { Meteor } from 'meteor/meteor';
import { importData } from './import-data';
import '../imports/api/methods';
import './publications';
import './rest-api';

Meteor.startup(() => {
    let needImportData = true;
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
          
          // Add epfl-member by default
          if (!Roles.userIsInRole(tequilaResponse.uniqueid, ['admin', 'epfl-member'], Roles.GLOBAL_GROUP)) {
            Roles.addUsersToRoles(tequilaResponse.uniqueid, 'epfl-member', Roles.GLOBAL_GROUP);  
          }
          
          return tequilaResponse.uniqueid;
        }; 
    }


});
