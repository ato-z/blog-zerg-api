import { Router } from '@atoz/router';
import { Home } from './controller';

export const router = new Router({
  prefix: '/v1',
  controller: [Home],
});
