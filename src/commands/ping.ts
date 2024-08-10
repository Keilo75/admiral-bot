import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(t("commands.ping")),
  execute: async ({ interaction }) => {
    const sent = await interaction.reply({
      content: t("system.pinging"),
      fetchReply: true,
    });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(t("system.pinged", { latency }));
  },
};
