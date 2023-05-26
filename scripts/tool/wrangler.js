const fs = require('fs');
const path = require('path');
const { wranglerConfig } = require('./configProxy');

const { compatibilityDate } = wranglerConfig;

const root = path.resolve(__dirname, '../..');
const srcPath = path.resolve(root, 'src');

const modulePaths = path.resolve(srcPath, 'modules');

const touchConfigByToml = moduleName => {
  const { name, database } = wranglerConfig;
  const deployName = `${name}-${moduleName}`;
  const deployKv = JSON.stringify(
    Object.keys(database).map(binding => ({ binding, ...database[binding] })),
  ).replace(/:/g, '=');
  const wranglerToml = `# kv 配置项将跟随 src/config/wrangler.json 改变
name = "${deployName}"
main = "index.ts"
compatibility_date = "${compatibilityDate}"
kv_namespaces = ${deployKv}
`;

  return wranglerToml;
};

const touchTomlFile = moduleName => {
  const wranglerToml = touchConfigByToml(moduleName);
  const wranglerFile = path.join(modulePaths, moduleName, 'wrangler.toml');
  try {
    fs.accessSync(wranglerFile);
  } catch {
    fs.writeFileSync(wranglerFile, wranglerToml, { flag: 'w+' });
  }
};

module.exports = { touchConfigByToml, touchTomlFile };
