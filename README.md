# AdmiralCloudbot

A discord bot to retrieve random [Admiral Cloudberg](https://admiralcloudberg.medium.com/) articles.

## Local Setup

1. Install Rust 1.92+.
2. Create a `.env` file with the following contents:

| Name | Description |
| --- | --- |
| DISCORD_TOKEN | The token for your bot account |
| ARTICLES_CSV_URL |  URL from which to fetch articles. Official data source is [Google Sheets](https://docs.google.com/spreadsheets/d/e/2PACX-1vSLdXXo1nKXxtS0WWVOcFIDI6gHw6cENWqsu8EBAOEhh9GOJ5Re-w3J90IjgQQW0XPNKwtL9a9fdZ4h/pub?gid=779386985&single=true&output=csv) |
| REFETCH_INTERVAL_MINUTES | How long to wait between article refetches in minutes |
| DATABASE_URL | SQLite database url. Example: `sqlite://database.db`
| LOG_CHANNEL_ID | Discord channel ID to use for info and error logs |
| LOG_USER_ID | Discord user ID to ping for errors |
| EMBED_COLOR | Color of the embed in hex format. Example: `#000000` |

3. Run the `register dev` command to add slash commands to a single guild.
4. Run the `migrate-database` command to create and migrate the database.
5. Run the `start` command to start the discord bot.

## Contributing

If you want to contribute, feel free to simply fork the repository and submit a PR.