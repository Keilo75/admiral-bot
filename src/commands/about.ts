import { SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { type Command } from "../models/command";
import { buildAboutEmbed } from "../models/embeds";

export const about: Command = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription(t("commands.about")),
  execute: async ({ interaction }) => {
    const embed = buildAboutEmbed();
    await interaction.reply({ embeds: [embed] });
  },
};
