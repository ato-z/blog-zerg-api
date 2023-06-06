import { App, type Context } from '@atoz/router';

import { router } from './routes/v1';

const app = new App();

app.use(router.install());

app.use((ctx: Context) => {
  const html = `
        hello world
    `;
  return html;
});

export default app;
