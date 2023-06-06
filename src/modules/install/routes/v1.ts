import { Router } from '@atoz/router';
import { Install } from './controller';

export const router = new Router({
  prefix: '/v1',
  controller: [Install],
});
