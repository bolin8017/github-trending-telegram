# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Node.js automation tool that scrapes GitHub Trending daily and sends the results to a Telegram group. It runs automatically via GitHub Actions at 9:00 AM (UTC+8) every day.

## Common Commands

```bash
# Install dependencies
npm install

# Run the bot (requires .env configuration)
npm start
# or
node index.js

# Test run (same as start)
npm test
```

## Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Required environment variables:
- `TELEGRAM_BOT_TOKEN`: Get from @BotFather on Telegram
- `TELEGRAM_CHAT_ID`: Your Telegram group/channel ID (negative for groups, positive for personal)

## Code Architecture

### Entry Point: index.js
- Loads environment variables via dotenv
- Validates `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
- Orchestrates the scraping and sending workflow
- Main function exported for potential reuse

### Scraping Layer: src/scraper.js
- **Function**: `scrapeGitHubTrending(limit = 25)`
- Uses axios + cheerio to parse GitHub Trending page
- Extracts: repo name, URL, description, language, stars, today's stars
- Returns array of project objects with `rank` property
- **Key selector**: `article.Box-row` for trending items
- **Note**: GitHub may change their HTML structure, requiring selector updates

### Messaging Layer: src/telegram.js
- **Function**: `formatMessage(projects)` - Formats projects into HTML message with emojis and separators
- **Function**: `sendToTelegram(botToken, chatId, projects)` - Sends to Telegram with automatic batching
- **Message limit**: 4096 characters (Telegram API limit)
- **Auto-batching**: Splits into batches of 5 projects if message exceeds limit
- **Rate limiting**: 1-second delay between batched messages
- **Parse mode**: HTML with `disable_web_page_preview: true`

### Automation: .github/workflows/daily-trending.yml
- **Schedule**: Daily at UTC 01:00 (Taiwan UTC+8 09:00)
- **Trigger**: Scheduled cron + manual `workflow_dispatch`
- **Node version**: 18
- **Secrets required**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

## Common Customizations

### Change number of projects scraped
Edit [index.js](index.js:23):
```javascript
const projects = await scrapeGitHubTrending(10); // Change to 10
```

### Change execution time
Edit [.github/workflows/daily-trending.yml](.github/workflows/daily-trending.yml:6) cron expression:
```yaml
- cron: '0 1 * * *'  # UTC 01:00 = Taiwan 09:00
```

### Scrape specific language
Edit [src/scraper.js](src/scraper.js:13) URL:
```javascript
const url = 'https://github.com/trending/javascript'; // For JavaScript only
```

### Customize message format
Edit the `formatMessage` function in [src/telegram.js](src/telegram.js:8-36)

## Important Notes

- GitHub Trending HTML structure may change - monitor scraper functionality
- Telegram Bot must be added to the target group with send message permissions
- Bot API has rate limits - batching includes delays to avoid hitting limits
- GitHub Actions free tier: sufficient for this daily task (runs in seconds)
