import { withLength } from '@/helper/functions';

/**
 * 长度校验
 * @param value
 * @param min
 * @param max
 */
export const length = (value: unknown, min: number, max: number) => {
  let msg = '并不具备可比较的长度属性';
  if (!withLength(value)) {
    return msg;
  }

  const { length } = value;
  if (length < min) {
    msg = `长度不能小于${min}`;
    return msg;
  }

  if (length > max) {
    msg = `长度不能大于${max}`;
    return msg;
  }

  return true;
};
