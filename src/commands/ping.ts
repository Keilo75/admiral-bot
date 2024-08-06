import { SlashCommandBuilder } from "discord.js";
import i18next from "i18next";

import { Command } from "../models";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's current ping."),
  execute: async (interaction) => {
    const sent = await interaction.reply({
      content: i18next.t("system.pinging"),
      fetchReply: true,
    });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(i18next.t("system.pinged", { latency }));
  },
};
