import sha1 from 'sha1';
import { ServiceSignle } from './Signle';
import type { Context } from '@atoz/router';
import { ServiceDatabase } from './Database';
import {
  ExceptionMissManagement,
  ExceptionMissToken,
  ExceptionParam,
} from '@/exception';

type Name = string;
type Token = string;

export class ServiceToken extends ServiceSignle {
  protected nameMap: Record<Name, Token> = {};
  protected tokenMap: Record<Token, { name: Name; password: string }> = {};

  /**
   * 创建一个Token
   * @param s
   * @param r
   * @returns
   */
  createByManagement(s: TableManagementS, r: TableManagementR) {
    const token = sha1(`${s.name}${s.level}${r.password}${Date.now()}`);
    Reflect.set(this.nameMap, s.name, token);
    Reflect.set(this.tokenMap, token, { name: s.name, password: r.password });
    return token;
  }

  /**
   * 通过上下文信息获取管理员信息
   * @param ctx
   * @returns
   */
  async getManagementByCtx(ctx: Context) {
    const { name, password } = this.getTokenDataByCtx(ctx);
    const serviceDatabase = ServiceDatabase.instance<ServiceDatabase>(this.env);
    const management = await serviceDatabase.management.get(name);
    if (management === null) {
      throw new ExceptionMissManagement();
    }

    if (management.value.password !== password) {
      throw new ExceptionParam('token已失效');
    }

    const { level, nickname } = management.metadata;
    const { cover, createDate } = management.value;
    return { name, nickname, level, createDate, cover };
  }

  /**
   * 通过当前请求的上下文获取token信息
   * @param ctx
   * @returns
   */
  private getTokenDataByCtx(ctx: Context) {
    const { headers } = ctx;
    const token = headers.get('token');
    if (!token) {
      throw new ExceptionMissToken();
    }

    const findToken = Reflect.get(this.tokenMap, token);
    if (findToken === undefined) {
      throw new ExceptionMissToken();
    }

    return findToken;
  }
}
