import { SlashCommandBuilder } from "discord.js";
import i18next from "i18next";

import { type Command } from "../models/command";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(i18next.t("descriptions.ping")),
  execute: async (interaction) => {
    const sent = await interaction.reply({
      content: i18next.t("system.pinging"),
      fetchReply: true,
    });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(i18next.t("system.pinged", { latency }));
  },
};
