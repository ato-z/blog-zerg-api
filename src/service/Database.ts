import { KvStore } from '@atoz/kvstore';
import { ServiceSignle } from './Signle';

/**
 * 单例模式，返回kv数据库
 */
export class ServiceDatabase extends ServiceSignle {
  protected tableMap: {
    [P in keyof KVEnv]?: KvStore<any, any>;
  } = {};

  /**
   * 管理员表
   */
  get management(): KvStore<TableManagementS, TableManagementR> {
    const { tableMap } = this;
    if (tableMap.BLOG_MANAGEMENT !== undefined) {
      return tableMap.BLOG_MANAGEMENT;
    }

    const { env } = this;
    const management = new KvStore<TableManagementS, TableManagementR>(
      env.BLOG_MANAGEMENT,
    );

    tableMap.BLOG_MANAGEMENT = management;

    return management;
  }
}
