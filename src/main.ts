import dotenv from "dotenv";
import { Client, Events, GatewayIntentBits } from "discord.js";

import { Logger } from "./utils";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const logger = new Logger();

client.once(Events.ClientReady, (readyClient) => {
  logger.info(`Logged in as ${readyClient.user.tag}.`);
});

client.login(process.env.DISCORD_TOKEN);
