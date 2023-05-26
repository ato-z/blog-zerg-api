const { moduleDirs, modulePaths } = require('./tool');
const shell = require('shelljs');
const path = require('path');
const { touchTomlFile } = require('./tool/wrangler');

const deployAModule = moduleName => {
  touchTomlFile(moduleName);

  const wranglerMain = path.join(modulePaths, moduleName);
  shell.exec(`cd ${wranglerMain} && wrangler publish`);
};

moduleDirs.forEach(deployAModule);
