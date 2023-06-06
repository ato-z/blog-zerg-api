import { App, type Router } from '@atoz/router';
import { useMiddleware } from '@/middleware';

export const createApp = (router: Router<new () => unknown>) => {
  const app = new App();
  // 添加中间件
  useMiddleware(app);

  // 导入路由
  app.use(router.install());

  return app;
};
