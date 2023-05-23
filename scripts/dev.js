const fs = require('fs');
const inquirer = require('inquirer');
const shell = require('shelljs');
const path = require('path');
const { touchTomlFile } = require('./tool/wrangler');

const root = path.resolve(__dirname, '..');
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
