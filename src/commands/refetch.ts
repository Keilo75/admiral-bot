import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";

export const refetch: Command = {
  data: new SlashCommandBuilder()
    .setName("refetch")
    .setDescription(t("commands.refetch")),
  cooldown: 10_000,
  execute: async ({ interaction }) => {
    await interaction.reply({ content: "hey!", ephemeral: true });
  },
};
