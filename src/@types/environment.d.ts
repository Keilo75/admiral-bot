declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      CLIENT_ID: string;
      GUILD_ID: string;
      ARTICLES_DOWNLOAD_URL: string;
    }
  }
}

export {};
