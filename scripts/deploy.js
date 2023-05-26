const { moduleDirs } = require('./tool');
const shell = require('shelljs');
const path = require('path');
const { touchTomlFile } = require('./tool/wrangler');

const root = path.resolve(__dirname, '..');
const srcPath = path.resolve(root, 'src');

const modulePaths = path.resolve(srcPath, 'modules');

const deployAModule = moduleName => {
  touchTomlFile(moduleName);

  const wranglerMain = path.join(modulePaths, moduleName);
  shell.exec(`cd ${wranglerMain} && wrangler publish`);
};

moduleDirs.forEach(deployAModule);
