require('dotenv').config();
const { scrapeGitHubTrending } = require('./src/scraper');
const { sendToTelegram } = require('./src/telegram');

/**
 * 主函數：抓取 GitHub Trending 並發送到 Telegram
 */
async function main() {
  try {
    console.log('========================================');
    console.log('GitHub Trending to Telegram Bot 啟動');
    console.log('========================================\n');

    // 檢查環境變數
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error('請設置 TELEGRAM_BOT_TOKEN 和 TELEGRAM_CHAT_ID 環境變數');
    }

    // 抓取 GitHub Trending（所有 25 個項目）
    const projects = await scrapeGitHubTrending(25);

    if (projects.length === 0) {
      console.log('沒有抓取到任何項目');
      return;
    }

    // 發送到 Telegram
    await sendToTelegram(botToken, chatId, projects);

    console.log('\n========================================');
    console.log('任務完成！');
    console.log('========================================');

  } catch (error) {
    console.error('\n❌ 執行過程中發生錯誤:', error.message);
    process.exit(1);
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = { main };
