import sha1 from 'sha1';
import { ServiceSignle } from './Signle';
import type { Context } from '@atoz/router';
import { ServiceDatabase } from './Database';
import { site } from '@/config/site';
import {
  ExceptionMissManagement,
  ExceptionMissToken,
  ExceptionParam,
} from '@/exception';

type Token = string;
type TokenData = {
  name: string;
  level: number;
  nickname: string;
  password: string;
  expTime: number;
};

const { expTime } = site;

export class ServiceToken extends ServiceSignle {
  protected tokenExp: Record<Token, number> = {};
  protected tokenMap: Record<Token, TokenData> = {};

  get tmpKv() {
    const { env } = this;
    return env.BLOG_TMP;
  }

  /**
   * 创建一个Token
   * @param s
   * @param r
   * @returns
   */
  async createByManagement(s: TableManagementS, r: TableManagementR) {
    const { tmpKv } = this;
    const tokenData: TokenData = {
      name: s.name,
      nickname: s.nickname,
      level: s.level,
      password: r.password,
      expTime: Date.now() + expTime * 1000,
    };

    const token = sha1(`${s.name}${s.level}${r.password}${Date.now()}`);
    await tmpKv.put(`token:${token}`, JSON.stringify(tokenData), {
      expirationTtl: expTime,
    });

    Reflect.set(this.tokenMap, token, { name: s.name, password: r.password });
    return token;
  }

  /**
   * 通过上下文信息获取管理员信息
   * @param ctx
   * @returns
   */
  async getManagementByCtx(ctx: Context) {
    const { name, password } = await this.getTokenDataByCtx(ctx);
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
  private async getTokenDataByCtx(ctx: Context) {
    const { headers } = ctx;
    const token = headers.get('token');
    if (!token) {
      throw new ExceptionMissToken();
    }

    const findToken =
      this.getTokenByMemory(token) ?? (await this.getTokenByOnlineKv(token));

    if (findToken.expTime >= Date.now()) {
      throw new ExceptionMissToken('token已过期');
    }

    return findToken;
  }

  /**
   * 在运行内存中查找token信息
   */
  private getTokenByMemory(token: string) {
    const findToken = Reflect.get(this.tokenMap, token);

    if (findToken === undefined) {
      return null;
    }

    return findToken;
  }

  /**
   * 在kv数据库中查询缓存
   */
  private async getTokenByOnlineKv(token: string) {
    const { tmpKv } = this;
    const findToken = await tmpKv.get<TokenData>(`token:${token}`, {
      type: 'json',
      cacheTtl: expTime,
    });

    if (findToken === null) {
      throw new ExceptionMissToken();
    }

    return findToken;
  }
}
