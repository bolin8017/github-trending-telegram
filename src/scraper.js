const axios = require('axios');
const cheerio = require('cheerio');

/**
 * 抓取 GitHub Trending 頁面上的熱門項目
 * @param {number} limit - 要抓取的項目數量（預設 25）
 * @returns {Promise<Array>} 項目列表
 */
async function scrapeGitHubTrending(limit = 25) {
  try {
    console.log('開始抓取 GitHub Trending...');

    const url = 'https://github.com/trending';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const projects = [];

    // 選擇 trending 項目列表
    $('article.Box-row').each((index, element) => {
      if (index >= limit) return false; // 達到限制數量就停止

      const $element = $(element);

      // 提取項目資訊
      const repoName = $element.find('h2 a').text().trim().replace(/\s+/g, ' ');
      const repoUrl = 'https://github.com' + $element.find('h2 a').attr('href');

      // 提取描述
      const description = $element.find('p').text().trim() || '無描述';

      // 提取語言
      const language = $element.find('[itemprop="programmingLanguage"]').text().trim() || '未指定';

      // 提取星星數
      const starsText = $element.find('a[href*="/stargazers"]').first().text().trim();
      const stars = starsText || '0';

      // 提取今日新增星星數
      const todayStarsElement = $element.find('span.d-inline-block.float-sm-right');
      const todayStars = todayStarsElement.text().trim() || '0 stars today';

      projects.push({
        name: repoName,
        url: repoUrl,
        description,
        language,
        stars,
        todayStars,
        rank: index + 1
      });
    });

    console.log(`成功抓取 ${projects.length} 個項目`);
    return projects;

  } catch (error) {
    console.error('抓取 GitHub Trending 時發生錯誤:', error.message);
    throw error;
  }
}

module.exports = { scrapeGitHubTrending };
