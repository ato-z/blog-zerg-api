import { App, type Router } from '@atoz/router';
import { useMiddleware } from '@/middleware';

export const createApp = (...routers: Array<Router<new () => unknown>>) => {
  const app = new App();
  // 添加中间件
  useMiddleware(app);

  // 导入路由列表
  routers.forEach(router => {
    app.use(router.install());
  });

  return app;
};
