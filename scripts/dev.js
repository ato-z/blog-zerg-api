const { moduleDirs, modulePaths } = require('./tool');
const inquirer = require('inquirer');
const shell = require('shelljs');
const path = require('path');
const { touchTomlFile } = require('./tool/wrangler');

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
