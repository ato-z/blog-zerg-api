import { BaseException } from './base';

/**
 * 接口数据进行初始化
 */
export class ExceptionUninitialized extends BaseException {
  override errorCode = 10001;
  override message = '请先初始管理账户';
  override status = 400;
}

/**
 * 登录失败
 */
export class ExceptionMissManagement extends BaseException {
  override errorCode = 10101;
  override message = '管理账户不存在';
  override status = 403;
}

/**
 * 不存在token或已失效
 */
export class ExceptionMissToken extends BaseException {
  override errorCode = 20101;
  override message = 'Token不存在或已失效';
  override status = 403;
}
