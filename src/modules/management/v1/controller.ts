import { type Context, POST, GET, Group } from '@atoz/router';
import { resultSuccess } from '@/helper/functions';
import { DtoLogin } from './dto/Login';
import { ServiceManagement } from '@/service/Management';
import { ServiceToken } from '@/service/Token';

@Group('/management')
export class Management {
  @POST('login') async login(ctx: Context) {
    const post = await ctx.getBody<DtoLogin>();
    const dto = new DtoLogin(post);

    const service = new ServiceManagement(ctx.env);
    const sign = await service.touchSign(dto);
    return resultSuccess('ok', { sign });
  }

  @GET('token') async getToken(ctx: Context) {
    const { params } = ctx;
    const { sign } = params as { sign: string };
    const serviceManagement = new ServiceManagement(ctx.env);
    const management = await serviceManagement.decodeSign(sign);
    const token = ServiceToken.instance<ServiceToken>(
      ctx.env,
    ).createByManagement(management.metadata, management.value);
    return resultSuccess('ok', { token });
  }

  @GET('data') async getData(ctx: Context) {
    const management = await ServiceToken.instance<ServiceToken>(
      ctx.env,
    ).getManagementByCtx(ctx);

    return resultSuccess('ok', management);
  }
}
