/**
 * 单例模式
 */
export class ServiceSignle {
  static signle: any;
  static instance<T>(env: Env) {
    if (this.signle !== undefined) {
      return this.signle as T;
    }

    const instance = new this(env);
    this.signle = instance;
    return this.signle as T;
  }

  constructor(protected readonly env: Env) {}
}
