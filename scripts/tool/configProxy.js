const fs = require('fs');
const path = require('path');
const wranglerConfigPath = path.resolve(
  __dirname,
  '../../src/config/wrangler.json',
);
const prettier = require('prettier');

const prettierrc = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../.prettierrc')),
);

const wranglerConfig = require(wranglerConfigPath);

const checkDataBase = database => {
  Object.keys(database).forEach(key => {
    if (database[key] === null) {
      throw new Error(
        `KV binding "${key}" is null\ntry "npm run database:init"`,
      );
    }
  });
};

const saveConfig = config => {
  Object.assign(wranglerConfig, config);
  const json = JSON.stringify(wranglerConfig);
  const codeJson = prettier.format(json, { ...prettierrc, parser: 'json' });

  fs.writeFileSync(wranglerConfigPath, codeJson, { flag: 'w+' });
};

if (wranglerConfig.compatibilityDate === null) {
  const now = new Date();
  const fillZero = n => (n < 9 ? `0${n}` : n.toString());

  const compatibilityDate = `${now.getFullYear()}-${fillZero(
    now.getMonth() + 1,
  )}-${fillZero(now.getDate() + 1)}`;

  saveConfig({ compatibilityDate });
}

checkDataBase(wranglerConfig.database);

module.exports = { wranglerConfig, saveConfig };
