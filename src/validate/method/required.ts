/**
 * 不能为空
 * @param value
 */
export const required = (value: unknown) => {
  const msg = '不能为空';
  if (value === undefined || value === null || value === '') {
    return msg;
  }

  if (typeof value === 'string') {
    const spaceString = value.trimStart().trimEnd();
    if (spaceString.length === 0) {
      return msg;
    }
  }

  return true;
};
