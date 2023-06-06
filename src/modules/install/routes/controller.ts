import { type Context, GET, Group } from '@atoz/router';
import { resultSuccess } from '@/helper/functions';
import { ServiceDataBase } from '@/modules/install/service/database';

@Group('/install')
export class Install {
  @GET('todo')
  todo() {
    return resultSuccess('ok', [
      {
        title: '初始数据',
        url: '/install/database',
      },
      {
        title: '创建账户',
        url: '/install/account',
      },
    ]);
  }

  @GET('/database')
  async index(ctx: Context) {
    const serviceDataBase = new ServiceDataBase(ctx.env);
    await serviceDataBase.install();
    return resultSuccess('数据初始化完成');
  }

  @GET('/account')
  async account(ctx: Context) {
    const serviceDataBase = new ServiceDataBase(ctx.env);
    await serviceDataBase.withAccount();
    return resultSuccess('管理员账户已创建');
  }
}
