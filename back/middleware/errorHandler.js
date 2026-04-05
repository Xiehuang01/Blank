const { error } = require('../utils/response');

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);

  if (err.type === 'entity.too.large') {
    return error(res, '请求体过大', 413);
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return error(res, '文件大小超出限制', 413);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return error(res, '不允许的文件字段', 400);
  }

  return error(res, err.message || '服务器内部错误', err.statusCode || 500);
};

module.exports = { errorHandler };
