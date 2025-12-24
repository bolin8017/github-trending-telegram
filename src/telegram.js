const TelegramBot = require('node-telegram-bot-api');

/**
 * 格式化項目資訊為 Telegram 訊息
 * @param {Array} projects - 項目列表
 * @returns {string} 格式化的訊息
 */
function formatMessage(projects) {
  const date = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  let message = `🔥 <b>GitHub Trending - ${date}</b> 🔥\n\n`;
  message += `今天共有 ${projects.length} 個熱門項目：\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  projects.forEach((project, index) => {
    message += `<b>${index + 1}. ${project.name}</b>\n`;
    message += `🔗 <a href="${project.url}">查看項目</a>\n`;
    message += `📝 ${project.description}\n`;
    message += `💻 語言: ${project.language}\n`;
    message += `⭐ Stars: ${project.stars}\n`;
    message += `📈 今日: ${project.todayStars}\n`;

    if (index < projects.length - 1) {
      message += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    }
  });

  message += `\n\n🤖 每日自動更新 | 數據來源: GitHub Trending`;

  return message;
}

/**
 * 發送訊息到 Telegram
 * @param {string} botToken - Telegram Bot Token
 * @param {string} chatId - Telegram Chat ID
 * @param {Array} projects - 項目列表
 */
async function sendToTelegram(botToken, chatId, projects) {
  try {
    console.log('準備發送訊息到 Telegram...');

    const bot = new TelegramBot(botToken);
    const message = formatMessage(projects);

    // Telegram 訊息長度限制為 4096 字元
    // 如果訊息太長，分批發送
    if (message.length > 4096) {
      console.log('訊息過長，分批發送...');

      // 分批發送項目
      const batchSize = 5;
      for (let i = 0; i < projects.length; i += batchSize) {
        const batch = projects.slice(i, i + batchSize);
        const batchMessage = formatMessage(batch);

        await bot.sendMessage(chatId, batchMessage, {
          parse_mode: 'HTML',
          disable_web_page_preview: true
        });

        // 避免發送太快被限制
        if (i + batchSize < projects.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } else {
      await bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });
    }

    console.log('訊息發送成功！');
  } catch (error) {
    console.error('發送 Telegram 訊息時發生錯誤:', error.message);
    if (error.response) {
      console.error('API 回應:', error.response.body);
    }
    console.error('完整錯誤:', error);
    throw error;
  }
}

module.exports = { sendToTelegram, formatMessage };
