const MongoClient = require("mongodb").MongoClient;
var config = require("./config.js");
const dbHelpers = require("./db-helpers.js");
const helpers = require("./helpers.js");
const { exec } = require("child_process");

const _restore = async function (source) {
  const target = dbHelpers.getTarget(source);
  if (source === "prod-on-test") {
    source = "prod";
  }
  const sourceConnectionString = dbHelpers.getConnectionString(source);
  const targetConnectionString = dbHelpers.getConnectionString(target);

  console.log("STEP 0: PREPARE PARAMETERS");
  console.log(`DB Source ${source} => DB Target ${target}`);
  console.log(`ConnectionString of source: ${sourceConnectionString}`);
  console.log(`ConnectionString of target: ${targetConnectionString}`);
  console.log("");

  // Delete target DB
  console.debug("STEP 1: DELETE ALL DOCUMENTS");
  await dbHelpers.deleteAllDocuments(targetConnectionString, target);
  console.log("");

  // Delete dump folder
  console.log("STEP 2: DELETE DUMP FOLDER");
  await helpers.deleteDumpFolder();
  console.log("Delete dump folder");
  console.log("");

  // Dump source DB
  console.log("STEP 3: DUMP SOURCE DB");
  await dbHelpers.dumpMongoDB(sourceConnectionString);
  console.log("ConnectionString: ", sourceConnectionString);
  console.log(`Dump ${source} MongoDB`);
  console.log("");

  // wait few secondes
  await new Promise((resolve) => setTimeout(resolve, 8000));

  // Move dump/wp-polylex
  console.log("STEP 4: NEED TO MOVE dump/polylex ?");
  if (target === "localhost") {
    await helpers.moveDumpFolder();
    console.log("Move polylex/ to meteor/");
  } else {
    console.log("No");
  }
  console.log("");

  // wait few secondes
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Restore source DB on target DB
  console.log("STEP 5: RESTORE SOURCE ON TARGET");
  let dbName = "polylex";
  if (target === "localhost") {
    dbName = "meteor";
  }
  await dbHelpers.restoreMongoDB(targetConnectionString, dbName);
  console.log("");
};

module.exports.deleteAllDocuments = async function () {
  const target = "localhost";
  const connectionString = dbHelpers.getConnectionString(target);
  console.log("Connection string of Target:", connectionString);
  await dbHelpers.deleteAllDocuments(connectionString, target);
};

module.exports.restoreTestDatabase = async function () {
  const source = "test";
  await _restore(source);
  console.log("Restore test database");
  return true;
};

module.exports.restoreProdDatabase = async function () {
  await _restore("prod");
  console.log("Restore prod database");
  return true;
};

module.exports.restoreProdDatabaseOnTest = async function () {
  await _restore("prod-on-test");
  console.log("Restore prod database on test database");
  return true;
};
