import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { fetchArticles } from "../libs/data";
import { type Command } from "../models/command";

export const refetch: Command = {
  data: new SlashCommandBuilder()
    .setName("refetch")
    .setDescription(t("commands.refetch")),
  cooldown: 5 * 60 * 1000,
  execute: async ({ interaction, context }) => {
    const oldCount = context.getArticleCount();

    await interaction.reply({
      content: t("messages.refetching"),
      ephemeral: true,
    });

    const newArticles = await fetchArticles();
    context.populateArticles(newArticles);

    await interaction.editReply(
      t("messages.refetched", {
        new: context.getArticleCount(),
        prev: oldCount,
      })
    );
  },
};
