const { exec } = require("child_process");
const { promisify } = require("util");
const fs = require("fs");
const mv = promisify(fs.rename);
const config = require("./config.js");

/**
 * Deleting the dump/ directory
 */
module.exports.deleteDumpFolder = async function () {
  await new Promise(function (resolve, reject) {
    let command = `rm ${config.WORKSPACE_PATH}wp-polylex/dump/ -rf`;
    console.log(command);
    resolve(exec(command));
  });
};

/**
 * Move wp-polylex/dump/polylex/ to wp-polylex/dump/meteor/
 */
module.exports.moveDumpFolder = async () => {
  const source = `${config.WORKSPACE_PATH}wp-polylex/dump/polylex/`;
  const target = `${config.WORKSPACE_PATH}wp-polylex/dump/meteor/`;
  await mv(source, target);
};
