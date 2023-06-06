import { BaseException } from './base';

/**
 * 接口数据进行初始化
 */
export class ExceptionUninitialized extends BaseException {
  override errorCode = 10001;
  override message = '请先初始管理账户';
  override status = 400;
}
