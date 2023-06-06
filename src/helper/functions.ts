/**
 * 返回数据到前台
 * @param msg
 * @param data
 * @returns
 */
export const resultSuccess = (msg: string, data?: unknown) => ({
  msg,
  data,
  errorCode: 0,
});

/**
 * 返回當前東8區的時間對象
 */
export const getCurrentDate = () => {
  // eslint-disable-next-line no-mixed-operators
  const now = Date.now() + 8 * 3600000;
  const date = new Date(now);
  return date;
};

/**
 * 个位数填充0
 * @param {number} n 需要检验的字符
 * @returns 转化后的字符
 * ```
 * fillZero(1) // => 01
 * fillZero(10) // => 10
 * ```
 */
export const fillZero = (n: number) => {
  const codeN = n.toString();
  if (codeN.length > 1) {
    return codeN;
  }

  return `0${codeN}`;
};

/**
 * 特定格式时间字符串转实际时间
 * @param {string} dateString 需要格式的字符串，如: Y年m月d日 h时m分s秒
 * @param {Date}   _date        new Date()
 * @returns 格式化后的字符串: y-m-d H:i:s => 2022-02-02 10:00:00
 * ```
 * const datatime = date('Y年m月d日 h时m分s秒', new Date()) // => 2021年01月05日 10时10分10秒
 * ```
 */
export const date = function (dateString: string, _date?: Date): string {
  const reg = /[y|m|d|h|i|s]/gi;
  const date = _date ?? new Date(getCurrentDate());
  dateString = dateString.replace(reg, (val): string => {
    val = val.toUpperCase();
    switch (val) {
      case 'Y':
        return date.getFullYear().toString();
      case 'M':
        return fillZero(date.getMonth() + 1);
      case 'D':
        return fillZero(date.getDate());
      case 'H':
        return fillZero(date.getHours());
      case 'I':
        return fillZero(date.getMinutes());
      case 'S':
        return fillZero(date.getSeconds());

      default:
        return '';
    }
  });
  return dateString;
};
