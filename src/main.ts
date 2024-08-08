import "./libs/i18n";

import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import i18next from "i18next";

import { commands } from "./commands";
import { fetchArticles } from "./libs/data";
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
    Logger.error(`Unable to find '${commandName}' command.`);
    await interaction.reply(i18next.t("system.error"));
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    Logger.error(`Error while executing ${commandName}.`, err);

    const content = i18next.t("system.error");

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content });
    } else {
      await interaction.reply({ content });
    }
  }
});

fetchArticles()
  .then(() => {
    client.login(process.env.DISCORD_TOKEN);
  })
  .catch((err) => {
    Logger.error("Unable to fetch articles.", err);
    process.exit(1);
  });
