[
  'pkg',
  'logger',
  'dir',
].forEach((moduleName) => {
  Object.assign(exports, require(`./${moduleName}`));
});

exports.chalk = require('chalk');
exports.semver = require('semver');
