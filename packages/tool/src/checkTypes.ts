// 判断是否为数字类型
export const isNumber = (input: any): input is number =>
  /* eslint-disable-line */ /^[\d|\.]?\.?\d+$/.test(input.toString());

/** 转化为数字 */
export const toNumber = (val: any) => val / 1;
