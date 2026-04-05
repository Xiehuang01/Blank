const express = require('express');
const { auth } = require('../middleware/auth');
const db = require('../config/db');
const axios = require('axios');

const router = express.Router();

const TEXT_AI_COST = 5; // 文本相关AI功能消耗5邮分
const IMAGE_AI_COST = 10; // 图片分析AI功能消耗10邮分

const createBusinessError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * 扣除用户邮分
 * @param {number} userId - 用户ID
 * @param {number} cost - 消耗的邮分
 * @returns {Promise<boolean>} - 是否扣除成功
 */
async function deductCoins(userId, cost) {
  const [users] = await db.execute(
    'SELECT coins FROM users WHERE id = ?',
    [userId]
  );
  
  if (users.length === 0) {
    throw createBusinessError('用户不存在', 404);
  }
  
  const userCoins = users[0].coins;
  if (userCoins < cost) {
    throw createBusinessError('邮分不足，请先去签到或商店获取邮分', 400);
  }
  
  await db.execute(
    'UPDATE users SET coins = coins - ? WHERE id = ?',
    [cost, userId]
  );
  
  return true;
}

/**
 * 调用阿里云百炼平台 API
 * @param {string} prompt - 提示词
 * @param {string} model - 模型名称
 * @param {string|null} imageUrl - 图片URL（可选）
 * @returns {Promise<string>} - AI生成的内容
 */
async function callBailianAPI(prompt, model, imageUrl = null) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    throw createBusinessError('AI服务未配置，请联系管理员', 500);
  }

  const messages = [
    {
      role: 'system',
      content: '你是一位专业的明信片文案助手，擅长润色文字、根据图片生成诗意文案，以及根据用户需求定制文字内容。回复要简洁优美，适合明信片使用。'
    }
  ];

  if (imageUrl) {
    if (!(imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:image/'))) {
      throw createBusinessError('图片格式不支持，请重新上传后再试', 400);
    }

    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl } }
      ]
    });
  } else {
    messages.push({
      role: 'user',
      content: prompt
    });
  }

  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        model,
        messages,
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (typeof content === 'string' && content.trim()) {
      return content;
    }

    if (Array.isArray(content)) {
      const textContent = content
        .filter((item) => item?.type === 'text' && item?.text)
        .map((item) => item.text)
        .join('\n')
        .trim();
      if (textContent) return textContent;
    }

    throw new Error('AI服务返回格式异常');
  } catch (error) {
    const providerMessage = error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || '';
    const lowerMessage = String(providerMessage).toLowerCase();

    if (lowerMessage.includes('api key') || lowerMessage.includes('unauthorized') || lowerMessage.includes('authentication')) {
      throw createBusinessError('AI服务鉴权失败，请联系管理员检查配置', 500);
    }

    if (lowerMessage.includes('quota') || lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests')) {
      throw createBusinessError('AI服务当前繁忙，请稍后重试', 429);
    }

    if (lowerMessage.includes('model') && (lowerMessage.includes('not found') || lowerMessage.includes('not exist') || lowerMessage.includes('invalid'))) {
      throw createBusinessError('AI模型配置错误，请联系管理员处理', 500);
    }

    if (imageUrl && (lowerMessage.includes('image') || lowerMessage.includes('url') || lowerMessage.includes('download'))) {
      throw createBusinessError('图片无法被AI读取，请更换图片或重新上传后再试', 400);
    }

    throw createBusinessError(providerMessage || 'AI服务调用失败，请稍后重试', 500);
  }
}

/**
 * 一键润色文字
 * POST /api/ai/polish
 */
router.post('/polish', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ code: 400, message: '请输入需要润色的文字' });
    }

    // 扣除邮分
    await deductCoins(userId, TEXT_AI_COST);

    // 调用AI润色（qwen-turbo）
    const prompt = `请润色以下明信片文字，使其更优美、更有诗意，但保持原意。直接返回润色后的文字，不要添加任何解释或前缀：\n\n"${text}"`;
    const result = await callBailianAPI(prompt, 'qwen-turbo');

    res.json({
      code: 0,
      message: '润色成功',
      data: {
        result: result.trim(),
        cost: TEXT_AI_COST
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 分析图片生成文案
 * POST /api/ai/generate-from-image
 */
router.post('/generate-from-image', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ code: 400, message: '请先上传明信片正面图片' });
    }

    // 扣除邮分
    await deductCoins(userId, IMAGE_AI_COST);

    // 调用AI分析图片（qwen3.5-flash）
    const prompt = '请根据这张明信片图片，生成一段优美、简短、富有诗意的文案，适合写在明信片上。直接返回文案内容，不要添加任何解释或前缀。';
    const result = await callBailianAPI(prompt, 'qwen3.5-flash', imageUrl);

    res.json({
      code: 0,
      message: '生成成功',
      data: {
        result: result.trim(),
        cost: IMAGE_AI_COST
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 自定义要求修改文字
 * POST /api/ai/custom
 */
router.post('/custom', auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { text, requirement } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ code: 400, message: '请输入原始文字' });
    }

    if (!requirement || requirement.trim().length === 0) {
      return res.status(400).json({ code: 400, message: '请输入修改要求' });
    }

    // 扣除邮分
    await deductCoins(userId, TEXT_AI_COST);

    // 调用AI根据要求修改（qwen-turbo）
    const prompt = `请根据以下要求修改这段明信片文字：\n\n要求：${requirement}\n\n原文："${text}"\n\n直接返回修改后的文字，不要添加任何解释或前缀。`;
    const result = await callBailianAPI(prompt, 'qwen-turbo');

    res.json({
      code: 0,
      message: '修改成功',
      data: {
        result: result.trim(),
        cost: TEXT_AI_COST
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
