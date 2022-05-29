import fs from 'fs';
import path from 'path';
import readPkg from 'read-pkg';

export default (context: string) => {
  if (fs.existsSync(path.join(context, '.iconsetrc.js'))) {
    return require(path.join(context, '.iconsetrc.js'));
  }

  if (fs.existsSync(path.join(context, '.iconsetrc.json'))) {
    return require(path.join(context, '.iconsetrc.json'));
  }

  if (fs.existsSync(path.join(context, 'package.json'))) {
    return readPkg.sync({ cwd: context })?.iconsetConfig || {};
  }

  return {};
};
