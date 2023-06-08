import { ExceptionMissManagement, ExceptionParam } from '@/exception';
import { ServiceDatabase } from './Database';
import type { DtoLogin } from '@/modules/management/v1/dto/Login';
import { Validate } from '@/validate';
import { site } from '@/config/site';
import sha1 from 'sha1';

const { hash, signTime } = site;
export class ServiceManagement {
  /**
   * 加密明文密码
   * @param name
   * @param password
   * @param level
   * @returns
   */
  static encodePassword(name: string, password: string, level: number) {
    return sha1(
      `${hash}${name}${password}${level}${password.length}${
        password.length % name.length
      }`,
    );
  }

  protected serviceDatabase: ServiceDatabase;
  constructor(env: Env) {
    this.serviceDatabase = ServiceDatabase.instance<ServiceDatabase>(env);
  }

  /**
   * 返回一个登录密钥
   * @param post
   * @returns
   */
  async touchSign(post: DtoLogin) {
    this.checkLogin(post);
    const management = await this.getByManagementName(post.user);
    await this.checkManagement(
      management.metadata,
      management.value,
      post.password,
    );
    const sign = this.createSign(management.metadata, management.value);
    return sign;
  }

  /**
   * 创建用户登录凭证
   * @param s
   * @param r
   * @returns
   */
  async createSign(s: TableManagementS, r: TableManagementR) {
    const id = this.enCodeName(s.name);
    const now = Date.now().toString(16);
    const fingerprint = this.touchManagementFingerprint(s, r, now);
    const sign = [fingerprint, id, now].join('g');
    return sign;
  }

  /**
   * 解密用户登录凭证
   */
  async decodeSign(sign: string) {
    const [backFingerprint, codeName, createTime] = sign.split('g');
    if (
      backFingerprint === undefined ||
      codeName === undefined ||
      createTime === undefined
    ) {
      throw new ExceptionParam('无效sign');
    }

    const name = this.deCodeName(codeName);
    const management = await this.getByManagementName(name);

    const fingerprint = this.touchManagementFingerprint(
      management.metadata,
      management.value,
      createTime,
    );

    if (fingerprint !== backFingerprint) {
      throw new ExceptionParam('账号信息已修改');
    }

    const backupTime = parseInt(createTime, 16) + signTime;
    if (backupTime < Date.now()) {
      throw new ExceptionParam('sign已过期');
    }

    return management;
  }

  /**
   * 生成当前的管理账户特征
   */
  touchManagementFingerprint(
    s: TableManagementS,
    r: TableManagementR,
    hash: string,
  ) {
    return sha1(`${s.name}${r.password}${s.status}${s.level}${hash}`);
  }

  /**
   * 验证管理账号是否可用
   */
  async checkManagement(
    s: TableManagementS,
    r: TableManagementR,
    simpleCipher: string,
  ) {
    const codePassword = ServiceManagement.encodePassword(
      s.name,
      simpleCipher,
      s.level,
    );

    if (codePassword !== r.password) {
      throw new ExceptionParam('密码有误');
    }

    if (s.status === 0) {
      throw new ExceptionParam('账号未启用');
    }

    if (s.status === -1) {
      throw new ExceptionParam('账号不可用');
    }
  }

  /**
   * 获取管理账号
   */
  async getByManagementName(userName: string) {
    const { serviceDatabase } = this;
    const { management } = serviceDatabase;
    const result = await management.get(userName);
    if (result === null) {
      throw new ExceptionMissManagement();
    }

    return result;
  }

  /**
   * 校验登录用户参数信息
   * @param post
   */
  private checkLogin(post: DtoLogin) {
    new Validate(post, [
      {
        name: 'user',
        rule: {
          required: ['用户名$msg'],
          length: ['用户名$msg', 4, 12],
        },
      },
      {
        name: 'password',
        rule: {
          required: ['密码$msg'],
          length: ['密码$msg', 5, 32],
        },
      },
    ]).check();
  }

  /**
   * 返回每个字符的ASCII码
   * @param str
   * @returns
   */
  private enCodeName(name: string) {
    return name
      .split('')
      .map(i => i.charCodeAt(0).toString(16))
      .join('');
  }

  /**
   * 根据传入ASCII码返回字符串
   * @param str
   * @returns
   */
  private deCodeName(name: string) {
    const len = name.length;
    const chars = new Array<string>(len);
    let cur = 0;
    while (cur < len) {
      chars.push(`${name.at(cur++) ?? ''}${name.at(cur++) ?? ''}`);
    }

    return chars
      .map(ascii => String.fromCharCode(parseInt(ascii, 16)))
      .join('');
  }
}
