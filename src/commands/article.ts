import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { buildArticleEmbed } from "../models/article";
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
    const filtered = context.filterArticlesByTitleOrIdentifier(query);
    await interaction.respond(filtered);
  },
};
