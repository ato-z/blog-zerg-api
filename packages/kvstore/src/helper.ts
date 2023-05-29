export const withCursor = <
  T extends Record<string | number | symbol, unknown>,
  S,
>(
  input: T,
): input is T & { cursor: S } => input['cursor'] !== undefined;

export type KvItem<S> = {
  list: null | Array<{ key: string; data: S }>;
  cursor: string | null;
  over: boolean;
};
