import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";

export const article: Command = {
  data: new SlashCommandBuilder()
    .setName("article")
    .setDescription(t("commands.article"))
    .addStringOption((o) =>
      o
        .setName("query")
        .setDescription(t("commands.query"))
        .setRequired(true)
        .setAutocomplete(true)
    ),
  execute: async ({ interaction }) => {
    await interaction.reply("Received!");
  },
  autocomplete: async ({ interaction }) => {
    console.log(interaction.options.getFocused());
  },
};
