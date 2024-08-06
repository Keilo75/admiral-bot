import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import { commands } from "./commands";
import { Logger } from "./utils";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  Logger.info(`Logged in as ${readyClient.user.tag}.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const command = commands.get(commandName);
  if (!command) {
    // TODO: Display error to user
    Logger.error(`Unable to find '${commandName}' command.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    // TODO: Display error to user.
    Logger.error(`Error while executing ${commandName}.`, err);
  }
});

client.login(process.env.DISCORD_TOKEN);
