# GitHub Trending to Telegram Bot

每天自動從 GitHub Trending 抓取熱門項目，並發送到你的 Telegram 群組。

## 功能特點

- 🔥 每天自動抓取 GitHub Trending 所有 14 個熱門項目
- 📱 自動發送到 Telegram 群組或頻道
- 📊 包含項目描述、程式語言、星星數、今日新增星星數
- ⏰ 每天早上 9:00 自動執行
- 🚀 使用 GitHub Actions，完全免費且無需自己的伺服器

## 效果預覽

訊息格式範例：

```
🔥 GitHub Trending - 2024年12月24日 星期二 🔥

今天共有 14 個熱門項目：
━━━━━━━━━━━━━━━━━━━━

1. username/project-name
🔗 查看項目
📝 專案描述內容
💻 語言: JavaScript
⭐ Stars: 12,345
📈 今日: 1,234 stars today

━━━━━━━━━━━━━━━━━━━━
...
```

## 快速開始

### 步驟 1: 創建 Telegram Bot

1. 在 Telegram 中搜尋 `@BotFather`
2. 發送 `/newbot` 命令
3. 按照提示設置 bot 名稱和用戶名
4. 完成後，BotFather 會給你一個 **Bot Token**，格式類似：
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
5. **保存這個 Token**，待會需要用到

### 步驟 2: 獲取 Chat ID

#### 方法一：使用群組（推薦）

1. 創建一個 Telegram 群組
2. 將你的 bot 加入群組（搜尋 bot 的用戶名並邀請）
3. 在群組中發送任意訊息（例如：`/start` 或 `hello`）
4. 在瀏覽器中打開以下網址（替換 `YOUR_BOT_TOKEN`）：
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
5. 在返回的 JSON 中找到 `"chat":{"id":-1234567890}`
6. 這個 **負數** 就是你的 Chat ID（群組 ID 都是負數）

#### 方法二：使用頻道

1. 創建一個 Telegram 頻道
2. 將你的 bot 設為頻道管理員
3. 在頻道中發送一則訊息
4. 使用上述相同的 API 網址獲取 Chat ID

#### 方法三：私人訊息

1. 直接與你的 bot 對話
2. 發送 `/start`
3. 使用相同的 API 獲取 Chat ID（個人對話的 ID 是正數）

### 步驟 3: Fork 此專案

1. 點擊 GitHub 頁面右上角的 **Fork** 按鈕
2. Fork 到你自己的 GitHub 帳號

### 步驟 4: 設置 GitHub Secrets

1. 進入你 Fork 的專案
2. 點擊 **Settings** > **Secrets and variables** > **Actions**
3. 點擊 **New repository secret**
4. 新增以下兩個 secrets：

   **Secret 1:**
   - Name: `TELEGRAM_BOT_TOKEN`
   - Value: 你在步驟 1 獲得的 Bot Token

   **Secret 2:**
   - Name: `TELEGRAM_CHAT_ID`
   - Value: 你在步驟 2 獲得的 Chat ID

### 步驟 5: 啟用 GitHub Actions

1. 進入你的專案，點擊 **Actions** 標籤
2. 如果看到需要啟用的提示，點擊 **I understand my workflows, go ahead and enable them**
3. 在左側選擇 **Daily GitHub Trending to Telegram**
4. 點擊 **Enable workflow**

### 步驟 6: 測試運行

不需要等到早上 9 點，你可以立即測試：

1. 進入 **Actions** 標籤
2. 選擇 **Daily GitHub Trending to Telegram** workflow
3. 點擊右側的 **Run workflow** 按鈕
4. 點擊綠色的 **Run workflow** 確認
5. 等待幾秒鐘，檢查你的 Telegram 群組是否收到訊息

## 本地運行（可選）

如果你想在本地測試：

1. Clone 專案：
   ```bash
   git clone https://github.com/YOUR_USERNAME/github-trending-telegram.git
   cd github-trending-telegram
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 創建 `.env` 文件：
   ```bash
   cp .env.example .env
   ```

4. 編輯 `.env` 文件，填入你的資訊：
   ```
   TELEGRAM_BOT_TOKEN=你的_Bot_Token
   TELEGRAM_CHAT_ID=你的_Chat_ID
   ```

5. 運行：
   ```bash
   node index.js
   ```

## 自訂設置

### 修改發送時間

編輯 [.github/workflows/daily-trending.yml](.github/workflows/daily-trending.yml) 文件中的 cron 表達式：

```yaml
schedule:
  - cron: '0 1 * * *'  # UTC 01:00 = 台灣時間 09:00
```

時區對照：
- 早上 8:00 (台灣) = `0 0 * * *` (UTC 00:00)
- 早上 9:00 (台灣) = `0 1 * * *` (UTC 01:00)
- 中午 12:00 (台灣) = `0 4 * * *` (UTC 04:00)
- 晚上 6:00 (台灣) = `0 10 * * *` (UTC 10:00)

### 修改項目數量

編輯 [index.js](index.js) 文件，修改 `scrapeGitHubTrending` 的參數：

```javascript
// 只抓取前 10 個項目
const projects = await scrapeGitHubTrending(10);

// 抓取所有 25 個項目（預設）
const projects = await scrapeGitHubTrending(25);
```

### 抓取特定語言的 Trending

編輯 [src/scraper.js](src/scraper.js) 文件，修改 URL：

```javascript
// 所有語言（預設）
const url = 'https://github.com/trending';

// JavaScript
const url = 'https://github.com/trending/javascript';

// Python
const url = 'https://github.com/trending/python';

// Go
const url = 'https://github.com/trending/go';
```

## 技術架構

- **爬蟲引擎**: axios + cheerio
- **訊息發送**: node-telegram-bot-api
- **自動化**: GitHub Actions
- **語言**: Node.js

## 專案結構

```
github-trending-telegram/
├── .github/
│   └── workflows/
│       └── daily-trending.yml    # GitHub Actions 配置
├── src/
│   ├── scraper.js                # GitHub Trending 爬蟲
│   └── telegram.js               # Telegram 訊息發送
├── index.js                      # 主程式入口
├── package.json
├── .env.example                  # 環境變數範例
└── README.md
```

## 常見問題

### Q: 為什麼沒有收到訊息？

1. 檢查 GitHub Actions 是否成功運行（查看 Actions 標籤）
2. 確認 Secrets 設置正確
3. 確認 bot 已加入群組且有發送訊息的權限
4. 查看 Actions 的執行日誌尋找錯誤訊息

### Q: 可以發送到多個群組嗎？

可以！修改 [src/telegram.js](src/telegram.js)，在 `sendToTelegram` 函數中對多個 Chat ID 發送訊息。

### Q: GitHub Actions 免費嗎？

是的！GitHub Actions 對公開專案完全免費，私有專案每月有 2000 分鐘的免費額度，這個專案每次執行只需要幾秒鐘。

### Q: 可以修改訊息格式嗎？

可以！編輯 [src/telegram.js](src/telegram.js) 中的 `formatMessage` 函數來自訂訊息格式。

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 相關連結

- [GitHub Trending](https://github.com/trending)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [GitHub Actions 文檔](https://docs.github.com/en/actions)
