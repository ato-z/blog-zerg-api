import type { App } from '@atoz/router';
import { middlewareException } from './exception';

export const useMiddleware = (app: App) => {
  app.use(middlewareException);
};
