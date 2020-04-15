import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'; 
import { AppLogger } from './logger';

Meteor.methods({
    updateRole(userId, role) {
        
        if (!this.userId) {
            throw new Meteor.Error('not connected');
        }
        const canUpdate = Roles.userIsInRole(
            this.userId,
            ['admin'], 
            Roles.GLOBAL_GROUP
        );
        if (! canUpdate) {
            throw new Meteor.Error('unauthorized',
              'Only admins can update roles.');
        }

        check(userId, String);
        
        let roleBeforeUpdate = Roles.getRolesForUser(userId);

        Roles.setUserRoles(userId, [role], Roles.GLOBAL_GROUP); 

        AppLogger.getLog().info(
          `Update role ID ${ userId }`, 
          { before: roleBeforeUpdate, after: [role] },
          userId
        );
    },
});