/**
 * 账户密钥相关配置
 */
export const site = {
  /** 密码加盐 */
  hash: 'wNB2+c#%',
  /** 用户登录密钥有效期， 登录密钥可换取token。 单位毫秒 */
  signTime: 30 * 24 * 3600 * 1000, // 30天有效
  /** token有效期 */
  expTime: 7200,
};
