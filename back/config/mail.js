const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.163.com',
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 验证连接
transporter.verify()
  .then(() => console.log('✅ Email transporter ready'))
  .catch(err => console.error('❌ Email transporter error:', err.message));

/**
 * 发送验证码邮件
 */
const sendVerificationEmail = async (to, code) => {
  const expiryMinutes = Math.max(1, Math.floor((parseInt(process.env.EMAIL_VERIFY_EXPIRY, 10) || 3600) / 60));
  const codeHtml = String(code)
    .split('')
    .map((digit) => `<span>${digit}</span>`)
    .join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Blank - 邮箱验证码',
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>验证码明信片</title>

<style>
body {
  margin: 0;
  background: #faf9f6;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.container {
  width: 450px;
  margin: 0 auto;
  text-align: center;
  padding: 24px 0;
}

.top-text {
  margin-bottom: 32px;
}

.top-text h2 {
  font-size: 22px;
  letter-spacing: 2px;
  margin-bottom: 6px;
  font-weight: 700;
  color: #3b4d61;
}

.top-text p {
  font-size: 13px;
  color: #8c9184;
}

.postcard {
  position: relative;
  width: 100%;
}

.card {
  background: #ffffff;
  border-radius: 0;
  border: 1px solid rgba(59, 77, 10, 0.15);
  box-shadow: 0 12px 28px rgba(59, 77, 97, 0.08);
  padding: 28px;
  overflow: hidden;
}

.left,
.right {
  width: 49%;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
}

.left {
  text-align: left;
  padding-right: 24px;
}

.left::before {
  content: "POSTCARD";
  display: block;
  font-size: 28px;
  letter-spacing: 1px;
  color: #3b4d61;
  margin-bottom: 16px;
  font-weight: 500;
  font-family: "Georgia", "Times New Roman", serif;
}

.label {
  font-size: 12px;
  color: #8c9184;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.code {
  width: 100%;
  font-family: monospace;
  color: #3b4d61;
  white-space: nowrap;
}

.code span {
  display: inline-block;
  width: 28px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-size: 22px;
  border: 1px solid #3b4d61;
  border-radius: 3px;
  margin-right: 6px;
}

.right {
  padding-left: 24px;
  text-align: left;
}

.right-content {
  font-size: 11.5px;
  color: #3b4d61;
  line-height: 1.7;
  letter-spacing: 0.4px;
  white-space: pre-line;
  padding-top: 10px;
  min-height: 126px;
}

.right-footer {
  font-size: 11px;
  color: #8c9184;
  margin-top: 16px;
}

.footer-line {
  width: 100%;
  height: 1px;
  background: rgba(59, 77, 97, 0.2);
  margin-top: 4px;
}

.bottom-text {
  margin-top: 26px;
  font-size: 12px;
  color: #8c9184;
  line-height: 1.6;
}
</style>
</head>

<body>
<div class="container">
  <div class="top-text">
    <h2>有一封信正在抵达</h2>
    <p>它会在某个安静的时刻被打开</p>
  </div>

  <div class="postcard">
    <div class="card">
      <div class="left">
        <div class="label">验证码</div>
        <div class="code">${codeHtml}</div>
      </div><div class="right">
        <div class="right-content">这一瞬的空白，是给回响留的位置。
等风来，等信往，等一个刚好。
未知美好，正在赶来。
等待值得，安静遇见。
无需催促，只需相信。</div>
        <div class="right-footer">
          from: BlankTeam
          <div class="footer-line"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="bottom-text">
    验证码有效期${expiryMinutes}分钟，请尽快完成验证<br>
    切勿向他人泄露验证码，以防账号风险
  </div>
</div>
</body>
</html>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendVerificationEmail };
