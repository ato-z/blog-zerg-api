import { type Context, POST, Group } from '@atoz/router';
import { resultSuccess } from '@/helper/functions';

@Group('/management')
export class Management {
  @POST('login') async login(ctx: Context) {
    const post = await ctx.getBody();
    return resultSuccess('ok', post);
  }
}
