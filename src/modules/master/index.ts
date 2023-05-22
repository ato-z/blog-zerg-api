import { App, type Context } from '@atoz/router';

import { router } from './routes/v1';

const app = new App();

app.use(router.install());

app.use((ctx: Context) => {
  const html = `
        <a href="/v1/home/index">/v1/home/index</a> <br />
        <a href="/v1/home/hi">/v1/home/hi</a> <br />
        <a href="/v1/about/me">/v1/about/me</a> <br />
    `;
  return html;
});

export default app;
