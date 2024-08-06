import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import { Logger } from "./utils";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  Logger.info(`Logged in as ${readyClient.user.tag}.`);
});

client.login(process.env.DISCORD_TOKEN);
