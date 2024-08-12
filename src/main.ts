import "./libs/i18n";

import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { t } from "i18next";

import { commands } from "./commands";
import { fetchArticles } from "./libs/data";
import { Context } from "./models/context";
import { Cooldowns } from "./models/cooldowns";
import { Logger } from "./utils";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  presence: {
    activities: [
      {
        name: t("status"),
        type: ActivityType.Listening,
      },
    ],
  },
});
const context = new Context();
const cooldowns = new Cooldowns();

client.once(Events.ClientReady, (readyClient) => {
  Logger.log(`Logged in as ${readyClient.user.tag}.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const command = commands.get(commandName);
  if (!command) {
    Logger.error(`Unable to find '${commandName}' command.`);
    await interaction.reply(t("messages.error"));
    return;
  }

  try {
    const cooldown = cooldowns.getCooldownState(command);
    if (cooldown.canExecute) {
      cooldowns.updateCooldowns(command);
      await command.execute({ interaction, context });
    } else {
      await interaction.reply({
        content: t("messages.cooldown", { duration: cooldown.remainingTime }),
        ephemeral: true,
      });
    }
  } catch (err) {
    Logger.error(`Error while executing ${commandName}.`, err);

    const content = t("messages.error");

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content });
    } else {
      await interaction.reply({ content });
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isAutocomplete()) return;

  const { commandName } = interaction;
  const command = commands.get(commandName);
  try {
    await command?.autocomplete?.({ interaction, context });
  } catch (err) {
    Logger.error(`Error while autocompleting ${commandName}.`, err);
  }
});

fetchArticles()
  .then((articles) => {
    context.populateArticles(articles);
    client.login(process.env.DISCORD_TOKEN);
  })
  .catch((err) => {
    Logger.error("Unable to fetch articles.", err);
    process.exit(1);
  });
