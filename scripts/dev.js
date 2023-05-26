const { moduleDirs } = require('./tool');
const inquirer = require('inquirer');
const shell = require('shelljs');
const path = require('path');
const { touchTomlFile } = require('./tool/wrangler');

const root = path.resolve(__dirname, '..');
const srcPath = path.resolve(root, 'src');

const modulePaths = path.resolve(srcPath, 'modules');

const devModule = moduleName => {
  touchTomlFile(moduleName);
  const wranglerMain = path.join(modulePaths, moduleName);
  shell.exec(`cd ${wranglerMain} && wrangler dev`);
};

inquirer
  .prompt(
    {
      type: 'list',
      name: 'moduleName',
      message: '选定开发目录进行调试',
      choices: moduleDirs,
    },
    moduleDirs,
  )
  .then(({ moduleName }) => devModule(moduleName));
