const toml = require('toml');
const fs = require('fs');
const path = require('path');

const { touchTomlFile } = require('./tool/wrangler');
const { wranglerConfig } = require('./tool/configProxy');
const { moduleDirs, modulePaths, root } = require('./tool');
const { database } = wranglerConfig;

const prettier = require('prettier');
const prettierrc = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../.prettierrc')),
);

const kvNamespaces = Object.keys(database).map(binding => {
  const item = { binding, ...database[binding] };
  const props = Object.keys(item).map(prop => [`${prop}="${item[prop]}"`]);
  return `{${props}}`;
});

/** 对齐kv配置 */
moduleDirs.forEach(moduleName => {
  touchTomlFile(moduleName);
  const wranglerTomlPath = path.resolve(
    modulePaths,
    moduleName,
    'wrangler.toml',
  );
  const wranglerToml = fs.readFileSync(wranglerTomlPath);

  const wranglerTomlJSON = toml.parse(wranglerToml);
  const wranglerTomlEntries = Object.entries(wranglerTomlJSON);

  const wranglerTomlConversion = [
    '# kv 配置项将跟随 src/config/wrangler.json 改变',
  ];
  wranglerTomlEntries.forEach(([name, value]) => {
    if (name !== 'kv_namespaces') {
      wranglerTomlConversion.push(`${name}="${value}"`);
    } else if (name === 'kv_namespaces') {
      wranglerTomlConversion.push(`${name}=[${kvNamespaces}]`);
    }
  });
  fs.writeFileSync(wranglerTomlPath, wranglerTomlConversion.join('\n'), {
    flag: 'w',
  });
});

const wranglerKVEnv = `
/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run \`npx wrangler dev src/index.ts\` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run \`npx wrangler publish src/index.ts --name my-worker\` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// 禁止修改，该类型由脚本维护
declare type KVEnv = {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace
  // KV_EXCEPTION: KVNamespace;
  ${Object.keys(database)
    .map(name => `${name}: KVNamespace`)
    .join(';')}
}
`;

const wranglerKVEnvTS = prettier.format(wranglerKVEnv, {
  ...prettierrc,
  parser: 'typescript',
});

fs.writeFileSync(path.resolve(root, 'types/kvs.d.ts'), wranglerKVEnvTS, {
  flag: 'w+',
});
