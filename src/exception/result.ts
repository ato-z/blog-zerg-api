import { BaseException } from './base';

/**
 * 成功的响应
 */
export class ExceptionSuccess extends BaseException {
  public override errorCode = 0;
  constructor(
    public override message: string = 'ok',
    public override data: unknown = null,
  ) {
    super(message);
  }
}

/**
 * 未知异常
 */
export class ExceptionUnknown extends BaseException {
  constructor(
    public override message: string = '网络异常',
    public override data: unknown = null,
  ) {
    super(message);
  }
}
