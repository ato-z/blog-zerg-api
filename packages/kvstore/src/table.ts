import { KvStore } from './store';

type TableProp = {
  name: string;
  total: number;
  current: number;
};
type DbStore = KvStore<TableProp, { ids: readonly number[] }>;
type Dictionary = Record<string | number | symbol, unknown>;
type KvStoreS<T> = T extends KvStore<infer S, any> ? S : any;
type KvStoreR<T> = T extends KvStore<any, infer R> ? R : any;

class Table {
  constructor(
    public tableName: string,
    protected db: DbStore,
    public table: KvStore<Dictionary, Dictionary>,
  ) {}

  /**
   * 插入数据
   * @param s 元数据
   * @param r 内容
   */
  async insert(
    s: KvStoreS<(typeof this)['table']>,
    r: KvStoreR<(typeof this)['table']>,
  ) {
    const { table } = this;
    const prop = await this.getMetadata();
    const id = prop.current + 1;

    const key = this.codeKeyId(id);
    await table.push(key, r, s);
    await this.insertLastId(id);
  }

  /**
   * 更新数据
   * @param s 元数据
   * @param r 内容
   */
  async update(
    id: number | string,
    s: KvStoreS<(typeof this)['table']>,
    r: KvStoreR<(typeof this)['table']>,
  ) {
    const { table } = this;
    const key: string = this.codeKeyId(id);
    await table.push(key, r, s);
  }

  /**
   * 删除数据
   */
  async remove(id: number | string) {
    const { table } = this;
    const key = this.codeKeyId(id);
    const intId = this.decodeKeyId(key);
    await table.remove(key);
    await this.removeAfter(intId);
  }

  /**
   * 编码传入id键
   * @param id
   */
  codeKeyId(id: number | string) {
    if (typeof id === 'string') {
      const intId = parseInt(id, 10);
      if (isNaN(intId)) {
        return id;
      }
    }

    return `id:${id}`;
  }

  /**
   * 解码传入id键
   * @param id
   */
  decodeKeyId(id: string) {
    const [, strId] = id.split(':');

    return parseInt(strId!, 10);
  }

  /**
   * 返回当前数据表的元信息
   */
  private async getMetadata() {
    const { db, tableName } = this;
    const { metadata } = (await db.get(tableName))!;
    return metadata;
  }

  /**
   * 更新插入后数据表元信息
   */
  private async insertLastId(id: number) {
    const { db, tableName } = this;
    const { value, metadata } = (await db.get(tableName))!;
    const ids = [...value.ids, id];
    const onlyIds = [...new Set<number>(ids)];

    await db.push(
      tableName,
      { ids: onlyIds },
      { ...metadata, current: id, total: metadata.total + 1 },
    );
  }

  /**
   * 更新删除后数据表元信息
   */
  private async removeAfter(id: number) {
    const { db, tableName } = this;
    const { value, metadata } = (await db.get(tableName))!;
    const ids = value.ids.filter(item => item !== id);
    const onlyIds = [...new Set<number>(ids)];

    await db.push(
      tableName,
      { ids: onlyIds },
      { ...metadata, total: metadata.total - 1 },
    );
  }
}

export class DataBase {
  protected db: DbStore;

  constructor(protected readonly dbKv: KVNamespace) {
    this.db = new KvStore(dbKv);
  }

  /**
   * 定位数据表
   * @param tableName
   * @param tableKv
   * @returns
   */
  async pointTable(
    tableName: string,
    tableKv: KvStore<Dictionary, Dictionary>,
  ) {
    const { db } = this;
    const result = await db.get(tableName);
    if (result === null) {
      throw new Error('not found table');
    }

    const table = new Table(tableName, db, tableKv);

    return table;
  }

  /**
   * 创建数据表
   * @param tableName
   */
  async createTable(tableName: string) {
    const { db } = this;
    await db.push(
      tableName,
      { ids: [] },
      {
        name: tableName,
        current: 0,
        total: 0,
      },
    );
  }
}
