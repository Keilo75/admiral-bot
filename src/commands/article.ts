import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";
import { buildArticleEmbed } from "../models/embeds";

export const article: Command = {
  data: new SlashCommandBuilder()
    .setName("article")
    .setDescription(t("commands.article"))
    .addStringOption((o) =>
      o
        .setName("query")
        .setDescription(t("commands.article-query"))
        .setRequired(true)
        .setAutocomplete(true)
        .setMaxLength(100)
    ),
  execute: async ({ interaction, context }) => {
    const selectedID = interaction.options.getString("query");
    const article = context.getArticleByID(selectedID || "");
    if (article === null) {
      await interaction.reply({
        content: t("messages.invalid-article-id"),
        ephemeral: true,
      });
      return;
    }

    const embed = buildArticleEmbed(article);
    await interaction.reply({ embeds: [embed] });
  },
  autocomplete: async ({ interaction, context }) => {
    const query = interaction.options.getFocused();
    const filtered =
      query.trim() === ""
        ? []
        : context.filterArticlesByTitleOrIdentifier(query);

    await interaction.respond(filtered);
  },
};
