import { Router } from '@atoz/router';
import { Management } from './controller';

export const router = new Router({
  prefix: '/v1',
  controller: [Management],
});
