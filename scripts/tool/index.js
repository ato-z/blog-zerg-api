const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const srcPath = path.resolve(root, 'src');

const modulePaths = path.resolve(srcPath, 'modules');
const modules = fs.readdirSync(modulePaths);

const moduleDirs = modules.filter(moduleName => {
  // 如果为.开头，则跳过
  if (/^\./.test(moduleName)) {
    return undefined;
  }

  const curPath = path.join(modulePaths, moduleName);
  try {
    const stat = fs.statSync(curPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
});

module.exports = { moduleDirs, root, srcPath, modulePaths };
