/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
//验证用户名
export function validName(str) {
  const reg = /^[\u4E00-\u9FA5]+(·[\u4E00-\u9FA5]+)*$/;
  return reg.test(str);
}

//验证手机号
export function validPhone(str) {
  const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  return reg.test(str);
}

// 验证密码   
export function validPassword(str) {
  const reg = /^\w+$/;
  return reg.test(str);
}

//验证验证码
export function validVerifyCode(str) {
  const reg = /^\d{6}$/;
  return reg.test(str);
}
