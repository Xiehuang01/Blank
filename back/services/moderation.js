const axios = require('axios');
const pool = require('../config/db');

const DASHSCOPE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

const MODERATION_PROMPT_IMAGE = `你是一个内容安全审核员。请审核这张图片是否包含以下违规内容：
1. 色情、裸露或性暗示内容
2. 血腥暴力或恐怖内容
3. 毒品或违禁药物相关内容
4. 政治敏感内容(国旗、国旗、敏感国家或地区、政治敏感内容、特别是台湾问题)
5. 其他违法或不良信息
6. 图片里的文字包含上面敏感内容

请严格按照以下JSON格式回复，不要添加任何其他文字：
{"pass": true} 或 {"pass": false, "reason": "具体违规原因"}`;

const MODERATION_PROMPT_TEXT = `你是一个内容安全审核员。请审核以下明信片文字内容是否包含违规信息：
1. 色情、低俗或性暗示内容
2. 血腥暴力或恐怖内容
3. 毒品或违禁药物相关内容
4. 政治敏感内容(特别是台湾问题)
5. 辱骂、歧视或仇恨言论
6. 其他违法或不良信息

请严格按照以下JSON格式回复，不要添加任何其他文字：
{"pass": true} 或 {"pass": false, "reason": "具体违规原因"}

待审核文字内容：
`;

async function callModeration(model, messages) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) return { pass: true };

  try {
    const response = await axios.post(
      DASHSCOPE_URL,
      { model, messages, max_tokens: 200, temperature: 0.1 },
      {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 60000,
      }
    );

    const raw = response.data?.choices?.[0]?.message?.content || '';
    const text = typeof raw === 'string' ? raw : (Array.isArray(raw) ? raw.filter(i => i?.type === 'text').map(i => i.text).join('') : '');

    // Extract JSON from response (may be wrapped in markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { pass: !!parsed.pass, reason: parsed.reason || '' };
    }

    // If we can't parse, assume pass
    return { pass: true };
  } catch (err) {
    console.error('Moderation API error:', err.message);
    // On API failure, let it pass to avoid blocking users
    return { pass: true };
  }
}

async function moderateImage(imageUrl) {
  const messages = [
    { role: 'system', content: '你是一个专业的内容安全审核系统。' },
    { role: 'user', content: [
      { type: 'text', text: MODERATION_PROMPT_IMAGE },
      { type: 'image_url', image_url: { url: imageUrl } },
    ] },
  ];
  return callModeration('qwen3.5-flash', messages);
}

async function moderateText(text) {
  if (!text || !text.trim()) return { pass: true };
  const messages = [
    { role: 'system', content: '你是一个专业的内容安全审核系统。' },
    { role: 'user', content: MODERATION_PROMPT_TEXT + text },
  ];
  return callModeration('qwen-turbo', messages);
}

/**
 * Run full moderation on a postcard (async, called after creation).
 * Updates postcards.status based on results.
 */
async function moderatePostcard(postcardId) {
  try {
    const [rows] = await pool.query(
      'SELECT id, user_id, image_url, title, elements FROM postcards WHERE id = ? LIMIT 1',
      [postcardId]
    );
    if (rows.length === 0) return;

    const postcard = rows[0];

    // Collect all text content: title + text elements
    let allText = postcard.title || '';
    try {
      const elements = typeof postcard.elements === 'string' ? JSON.parse(postcard.elements) : (postcard.elements || []);
      for (const el of elements) {
        if (el.type === 'text' && el.content) {
          allText += '\n' + el.content;
        }
      }
    } catch (e) { /* ignore parse errors */ }

    // Run image and text moderation in parallel
    const [imageResult, textResult] = await Promise.all([
      moderateImage(postcard.image_url),
      moderateText(allText.trim()),
    ]);

    if (imageResult.pass && textResult.pass) {
      // Both pass — auto approve
      await pool.query(
        "UPDATE postcards SET status = 'sent' WHERE id = ?",
        [postcardId]
      );
    } else {
      // At least one failed — send to manual review
      const reasons = [];
      if (!imageResult.pass) reasons.push(`图片: ${imageResult.reason}`);
      if (!textResult.pass) reasons.push(`文字: ${textResult.reason}`);
      const reason = reasons.join('; ');

      await pool.query(
        "UPDATE postcards SET status = 'pending', review_reason = ? WHERE id = ?",
        [reason, postcardId]
      );

      // Notify the user
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, content, postcard_id)
         VALUES (?, 'review', '明信片审核中', ?, ?)`,
        [
          postcard.user_id,
          `您的明信片"${postcard.title || '未命名'}"未通过自动审核（${reason}），已提交人工审核，请耐心等待。`,
          postcardId,
        ]
      );
    }
  } catch (err) {
    console.error('Moderation failed for postcard', postcardId, err);
    // On error, auto-approve to avoid blocking
    await pool.query("UPDATE postcards SET status = 'sent' WHERE id = ?", [postcardId]);
  }
}

module.exports = { moderatePostcard };
