/**
 * Heavily inspired from https://github.com/xolvio/cleaner/blob/25789cd6777bf5735fd0634cf3cbe77c5ab1ad84/cleaner.js
 * Removed underscore dependency
 */

if (Meteor.isServer) {
  const _resetDatabase = function (options) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error(
        'resetDatabase is not allowed outside of a development mode. ' +
        'Aborting.'
      );
    }

    options = options || {};
    var excludedCollections = ['system.indexes'];
    if (options.excludedCollections) {
      excludedCollections = excludedCollections.concat(options.excludedCollections);
    }

    var db = options.db || MongoInternals.defaultRemoteCollectionDriver().mongo.db;
    var getCollections = Meteor.wrapAsync(db.collections, db);
    var collections = getCollections();
    const appCollections = collections.filter(col =>
      !(
        col.collectionName.startsWith('velocity') ||
        excludedCollections.includes(col.collectionName)
      )
    );

    appCollections.forEach(appCollection => {
      const remove = Meteor.wrapAsync(appCollection.remove, appCollection);
      remove({}, {});
    });
  };

  export const resetDatabase = function(options, callback) {
    _resetDatabase(options);
    if (typeof callback === 'function') { callback(); }
  }
}
