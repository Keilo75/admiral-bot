import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { buildArticleEmbed } from "../models/article";
import { type Command } from "../models/command";

export const randomArticle: Command = {
  data: new SlashCommandBuilder()
    .setName("random-article")
    .setDescription(t("commands.random-article")),
  execute: async ({ interaction, context }) => {
    const article = context.getRandomArticle();

    const embed = buildArticleEmbed(article);
    await interaction.reply({ embeds: [embed] });
  },
};
