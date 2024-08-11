import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { SEARCHABLE_COLUMNS } from "../models/article";
import { type Command } from "../models/command";

export const search: Command = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription(t("commands.search"))
    .addStringOption((o) =>
      o
        .setName("column")
        .setDescription(t("commands.search-column"))
        .setRequired(true)
        .setChoices(SEARCHABLE_COLUMNS)
    )
    .addStringOption((o) =>
      o
        .setName("query")
        .setDescription(t("commands.search-query"))
        .setRequired(true)
    ),
  execute: async ({ interaction, context }) => {
    const column = interaction.options.getString("column")!;
    const query = interaction.options.getString("query")!;

    context.filterArticlesByQuery(column, query);
    await interaction.reply(query);
  },
};
