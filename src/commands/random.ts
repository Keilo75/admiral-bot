import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { buildArticleEmbed } from "../models/article";
import { type Command } from "../models/command";

export const random: Command = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription(t("commands.random")),
  execute: async ({ interaction, context }) => {
    const article = context.getRandomArticle();

    const embed = buildArticleEmbed(article);
    await interaction.reply({ embeds: [embed] });
  },
};
