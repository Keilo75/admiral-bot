import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { SEARCHABLE_COLUMNS } from "../models/article";
import { type Command } from "../models/command";
import { buildSearchResultEmbed } from "../models/embeds";

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
        .setMaxLength(100)
    ),
  execute: async ({ interaction, context }) => {
    const query = interaction.options.getString("query")!;

    const selectedColumn = SEARCHABLE_COLUMNS.find(
      (c) => c.value === interaction.options.getString("column")!
    )!;
    const column = selectedColumn.name;

    // @ts-expect-error As the `column` option has choices, it must be a `SearchableColumn`.
    const articles = context.filterArticlesByQuery(selectedColumn.value, query);
    if (articles.length === 0) {
      await interaction.reply(t("messages.no-results", { query, column }));
      return;
    }

    // TODO: Display pagination
    // 1 - 3 of 200 | Page 1 / 3

    const embed = buildSearchResultEmbed({
      articles: articles.slice(0, 5),
      query,
      column,
    });
    await interaction.reply({ embeds: [embed] });
  },
};
