import { Accounts } from "meteor/accounts-base";
import { ServiceConfiguration } from "meteor/service-configuration";
import { Roles } from "meteor/alanning:roles";


export const setEntraAuthConfig = async () => {
  // Validate the env values
  const tenantId = process.env.AUTH_ENTRA_TENANT_ID
  const clientId = process.env.AUTH_ENTRA_CLIENT_ID
  const secret = process.env.AUTH_ENTRA_SECRET

  if (
    !(clientId && secret && tenantId) &&
    !Meteor.isAppTest
  ) {
    throw Error(`
      Missing env vars:
        AUTH_ENTRA_TENANT_ID 
        AUTH_ENTRA_CLIENT_ID or
        AUTH_ENTRA_SECRET or
      `)
  }

  // set the entra config
  await ServiceConfiguration.configurations.upsertAsync(
    { service: "entra" },
    {
      $set: {
        tenantId: tenantId,
        clientId: clientId,
        secret: secret,
        loginStyle: 'redirect',
      },
    }
  );
}

Meteor.publish(null, function () {
  if (!this.userId) return this.ready();

  return Meteor.users.find(
    { _id: this.userId }
  )
});

Accounts.onCreateUser( (_options, user) => {
  // Use the sciper as the Mongo _id too
  user._id = user.services.entra.uniqueid;

  // When setting groups, remove the ending suffix in Entra groups that were added by entra
  user.services.entra.groups = user.services.entra.groups?.map(
    ( groupName: string ) => groupName.replace(/_AppGrpU$/, '')
  ) ?? []

  return user;
});

Accounts.onLogin(async (loginDetails: any) => {
  const sciper: string | undefined = loginDetails.user?._id

  if (!sciper) {
    console.error(`Unable to set a role without the sciper. No role set.`);
    return
  }

  const entraGroups: string[] = loginDetails.user?.services?.entra?.groups ?? []
  const currentGroups = await Roles.getRolesForUserAsync(sciper);

  if ( entraGroups.includes("wp-polylex-admins") ) {
    if ( !currentGroups.includes("admin") ) {
      Roles.setUserRoles(sciper, ["admin"], Roles.GLOBAL_GROUP);
    }
  } else if ( entraGroups.includes("wp-polylex-editors") ) {
    if ( !currentGroups.includes("editor" ) ) {
      Roles.setUserRoles(sciper ["editor"], Roles.GLOBAL_GROUP);
    }
  } else {
    if ( currentGroups.includes("epfl-member") ) {
      Roles.setUserRoles(sciper, ["epfl-member"], Roles.GLOBAL_GROUP);
    }
  }
});
