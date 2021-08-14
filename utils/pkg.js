const fs = require('fs');
const path = require('path');
const readPkg = require('read-pkg');

exports.resolveConfig = (context) => {
  if (fs.existsSync(path.join(context, 'iconset.config.js'))) {
    return require(path.join(context, 'iconset.config.js'));
  }

  if (fs.existsSync(path.join(context, 'package.json'))) {
    return readPkg.sync({ cwd: context })?.iconset;
  }

  return {};
};
