/**
 * 统一响应格式
 */
const success = (res, data = null, message = 'success', statusCode = 200) => {
  return res.status(statusCode).json({
    code: 0,
    message,
    data,
  });
};

const error = (res, message = '服务器错误', statusCode = 500, code = -1) => {
  return res.status(statusCode).json({
    code,
    message,
    data: null,
  });
};

const paginate = (res, list, total, page, pageSize) => {
  return res.status(200).json({
    code: 0,
    message: 'success',
    data: {
      list,
      pagination: {
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / pageSize),
      },
    },
  });
};

module.exports = { success, error, paginate };
