# Admiral Bot

A bot to search through all published articles of [Admiral Cloudberg](https://admiralcloudberg.medium.com/).

## Scripts

These scripts can be run with `npm run <script>`:

- `start`: Starts the bot.
- `dev`: Starts the bot and automatically reloads on file change.
- `lint`: Run ESLint.
- `test`: Run vitest.
- `scripts:register-commands:dev`: Register commands to a specific guild (`CLIENT_ID` and `GUILD_ID` environment variables must be set).
- `scripts:register-commands:prod`: Register commands globally (`CLIENT_ID` environment variable must be set).

## Contributing

If you want to contribute, feel free to simply fork the repository and submit a PR.

## Prerequisites

- NodeJS (v18 or newer)

## Local Setup

1. [Create a discord bot account](https://discord.com/developers/applications) and copy the token.
2. Clone the repository and run `npm install`.
3. Create a `.env` in the root directory:

```
DISCORD_TOKEN=***
DEV=TRUE # Cache articles locally.
```
