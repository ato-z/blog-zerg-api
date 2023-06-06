import { createApp } from '@/helper/createApp';
import { router } from './routes/v1';

const app = createApp(router);

export default app;
