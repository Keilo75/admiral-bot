import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SlashCommandBuilder,
} from "discord.js";
import { t } from "i18next";

import { SEARCHABLE_COLUMNS } from "../models/article";
import { type Command } from "../models/command";
import { buildSearchResultEmbed } from "../models/embeds";
import { Pagination } from "../models/pagination";

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

    const pagination = new Pagination(articles);

    const createSearchMessage = () => {
      const disabledButtons = pagination.getDisabledButtons();
      const prevButton = new ButtonBuilder()
        .setCustomId("prev")
        .setStyle(ButtonStyle.Primary)
        .setLabel(t("search.prev"))
        .setDisabled(disabledButtons.prev);

      const nextButton = new ButtonBuilder()
        .setCustomId("next")
        .setStyle(ButtonStyle.Primary)
        .setLabel(t("search.next"))
        .setDisabled(disabledButtons.next);

      const paginatedArticles = pagination.getPaginatedArticles();
      const embed = buildSearchResultEmbed({
        paginatedArticles,
        query,
        column,
      });
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        prevButton,
        nextButton
      );

      return { embeds: [embed], components: [row] };
    };

    const sent = await interaction.reply(createSearchMessage());

    const collector = sent.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 10_000,
    });

    collector.on("end", async () => {
      await interaction.editReply({ components: [] });
    });
  },
};
