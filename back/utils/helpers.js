/**
 * 生成指定长度的数字验证码
 */
const generateCode = (length = 6) => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

/**
 * 生成7位随机UID
 */
const generateUID = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
};

module.exports = { generateCode, generateUID };
