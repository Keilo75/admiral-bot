import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";

export const refetch: Command = {
  data: new SlashCommandBuilder()
    .setName("refetch")
    .setDescription(t("commands.refetch")),
  execute: async ({ interaction, context }) => {
    await interaction.reply({ content: "", ephemeral: true });
  },
};
