import { type Context, POST, Group } from '@atoz/router';
import { resultSuccess } from '@/helper/functions';
import { DtoLogin } from './dto/Login';
import { Validate } from '@/validate';

@Group('/management')
export class Management {
  @POST('login') async login(ctx: Context) {
    const post = new DtoLogin(await ctx.getBody());
    await new Validate(post, [
      {
        name: 'user',
        rule: {
          length: ['用户名$msg', 4, 12],
        },
      },
      {
        name: 'password',
        rule: {
          required: ['密码$msg'],
        },
      },
    ]).check();
    return resultSuccess('ok', post);
  }
}
