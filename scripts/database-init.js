const oraPromise = import('ora');
const fs = require('fs');
const path = require('path');
const toml = require('toml');
const { saveConfig, wranglerConfig } = require('./tool/configProxy');
const shell = require('shelljs');
const { database } = wranglerConfig;

const wranglerConfigToml = toml.parse(
  fs.readFileSync(path.resolve(__dirname, '../wrangler.toml')),
);

const createList = [];
const triggerOver = spinner => {
  spinner.start();
  shell.exec('wrangler kv:namespace list', (code, out) => {
    shell.exec('clear', () => {
      let list = [];
      const database = {};
      try {
        const [start, end] = [out.indexOf('['), out.indexOf(']')];
        list = JSON.parse(out.substring(start, end + 1));
      } catch {}

      if (list.length === 0) {
        return spinner.fail('🙊 The kv list is empty');
      }

      createList.forEach(({ currentDBName, kvName, state }) => {
        if (state) {
          spinner.succeed(`succeed ${currentDBName}`);
          const item = list.find(
            item => item.title === `${wranglerConfigToml.name}-${kvName}`,
          );
          if (item) {
            // eslint-disable-next-line camelcase
            database[currentDBName] = { id: item.id, preview_id: item.id };
          }
        }

        if (state === false) {
          spinner.fail(`fail ${currentDBName}`);
        }
      });

      saveConfig({
        database: { ...wranglerConfig.database, ...database },
      });
    });
  });
};

const emptyDataBase = Object.keys(database).filter(
  dbname => database[dbname] === null,
);
const trigger = spinner => {
  const currentDBName = emptyDataBase.shift();
  if (currentDBName === undefined) {
    spinner.stop();
    return triggerOver(spinner);
  }

  spinner.start(currentDBName);

  const kvName = `${currentDBName}`.replace(/-/g, '_').toUpperCase();
  const sh = `wrangler kv:namespace create ${kvName}`;
  shell.exec(sh, code => {
    if (code === 1) {
      spinner.fail(`Failure "${currentDBName}"`);
    } else if (code === 0) {
      spinner.succeed(currentDBName);
    }

    createList.push({ currentDBName, kvName, state: code === 0 });
    trigger(spinner);
  });
};

oraPromise.then(ora => {
  const spinner = ora.default('').start();
  spinner.color = 'yellow';
  spinner.prefixText = '🦁 Creating kv';
  trigger(spinner);
});
