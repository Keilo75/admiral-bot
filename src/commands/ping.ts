import { SlashCommandBuilder } from "discord.js";

import { Command } from "../models";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's current ping."),
  execute: async (interaction) => {
    await interaction.reply("Hey!");
  },
};
