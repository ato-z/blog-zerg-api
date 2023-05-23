const toml = require('toml');
const fs = require('fs');
const path = require('path');

const compatibilityDate = '2023-05-17';

const root = path.resolve(__dirname, '../..');
const srcPath = path.resolve(root, 'src');
const configPath = path.resolve(root, 'wrangler.toml');
const someTomlString = fs.readFileSync(configPath);
const wranglerConfig = toml.parse(someTomlString);

const modulePaths = path.resolve(srcPath, 'modules');

const touchConfigByToml = moduleName => {
  // eslint-disable-next-line camelcase
  const { name, kv_namespaces } = wranglerConfig;
  const deployName = `${name}-${moduleName}`;
  const deployKv = JSON.stringify(kv_namespaces).replace(/:/g, '=');
  const wranglerToml = `# 脚本生成的配置文件，请勿修改
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
