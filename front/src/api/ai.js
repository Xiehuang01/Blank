import request from '../utils/request.js';

/**
 * 一键润色文字
 * @param {string} text - 需要润色的文字
 * @returns {Promise<{result: string, cost: number}>}
 */
export const polishText = (text) => {
  return request.post('/ai/polish', { text }, { skipGlobalLoading: true });
};

/**
 * 分析图片生成文案
 * @param {string} imageUrl - 图片URL
 * @returns {Promise<{result: string, cost: number}>}
 */
export const generateFromImage = (imageUrl) => {
  return request.post('/ai/generate-from-image', { imageUrl }, { skipGlobalLoading: true });
};

/**
 * 自定义要求修改文字
 * @param {string} text - 原始文字
 * @param {string} requirement - 修改要求
 * @returns {Promise<{result: string, cost: number}>}
 */
export const customModify = (text, requirement) => {
  return request.post('/ai/custom', { text, requirement }, { skipGlobalLoading: true });
};
