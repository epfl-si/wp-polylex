const MongoClient = require('mongodb').MongoClient;
var config = require("./config.js");
const { exec } = require('child_process');
/**
 * Delete all documents of collection
 * @param {} connectionString of the DB
 */
const _deleteAllDocuments = async function (connectionString) {

  // We remove documents only of localhost DB
  if (!connectionString.includes('localhost')) {
    throw "STOP don't TOUCH !";
  }
  const client = await MongoClient.connect(connectionString, {useUnifiedTopology: true});
  const db = client.db("meteor");

  collectionsList = [
    'AppLogs',
    'categories',
    'lexes',
    'responsibles',
    'subcategories',
  ]
  
  collectionsList.forEach(async collection => { 
    let c = await db.collection(collection).deleteMany({});
    console.log(`All documents off ${ collection } collections are deleted`);
  });

  await db.collection("users").deleteMany({"username":{$nin:["charmier"]}});
  console.log(`All documents off users collections are deleted`);

  client.close();

  return true;
}

/**
 * Deleting the dump/ directory
 */
const _deleteDumpFolder = async function () {
  await new Promise(
    function(resolve, reject) {
      let command = `rm ${ config.WORKSPACE_PATH }wp-polylex/dump/ -rf`;
      resolve(exec(command));
    }
  );

  return true;
}

/**
 * Dump MongoDB
 * 
 * ConnectionString of test DB: 'mongodb://polylex:<password>@test-mongodb-svc-1.epfl.ch/polylex'
 * ConnectionString of prod DB: 'mongodb://polylex:<password>@mongodb-svc-1.epfl.ch/polylex'
 */
const _dumpMongoDB = async function (source) {
  await new Promise(
    function(resolve, reject) {
      let HOST;
      let DB_PWD;
      if (source == "prod") {
        HOST = config.PROD_HOST;
        DB_PWD = config.PROD_DB_PWD;
        ALIAS = 'mongodb-svc-1';
      } else if (source == "test") {
        HOST = config.TEST_HOST;
        DB_PWD = config.TEST_DB_PWD;
        ALIAS = 'test-mongodb-svc-1';
      }
      let connectionString = `mongodb://${ HOST }:${ DB_PWD }@${ ALIAS }.epfl.ch/${ HOST }`;
      let command = `mongodump --forceTableScan  --uri ${ connectionString }`;
      resolve(exec(command));
    }
  );
  return true;
}

const _moveDumpFolder =  async function (source) {
  await new Promise(
    function(resolve, reject) { 
      const folder_name = "polylex";
      let command = `mv ${ config.WORKSPACE_PATH }wp-polylex/dump/${ folder_name }/ ${ config.WORKSPACE_PATH }wp-polylex/dump/meteor/`;
      resolve(exec(command));
    }
  );
  return true;
}

const _restoreDataToLocalMongoDB = async function() {
  await new Promise(
    function(resolve, reject) { 
      let command = "mongorestore dump/ --host=localhost:3001";
      resolve(exec(command));
    }
  )
  return true;
}

const _restore = async function (source) {
  
  const connectionString = `mongodb://localhost:3001/`;
  await _deleteAllDocuments(connectionString);

  await _deleteDumpFolder();
  console.log("Delete dump folder");

  // wait few secondes
  await new Promise(resolve => setTimeout(resolve, 5000));

  await _dumpMongoDB(source);
  console.log(`Dump ${source} MongoDB`);

  // wait few secondes
  await new Promise(resolve => setTimeout(resolve, 8000));

  await _moveDumpFolder(source);
  dbName = 'polylex';

  // wait few secondes
  await new Promise(resolve => setTimeout(resolve, 8000));

  console.log(`Move ${dbName}/ to meteor/`);

  await _restoreDataToLocalMongoDB();
  return true;
}

module.exports.deleteAllDocuments = async function () {
  const connectionString = `mongodb://localhost:3001/`;
  await _deleteAllDocuments(connectionString);
}

module.exports.restoreTestDatabase = async function () {
  await _restore('test');
  console.log("Restore test database");
  return true;
}

module.exports.restoreProdDatabase = async function () {
  await _restore('prod');
  console.log("Restore prod database");
  return true;
}

module.exports.restoreProdDatabaseOnTest = async function () {
  // TODO : restore prod database on test database
  console.log("Restore prod database on test database");
  return true;
}

