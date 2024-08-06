import { SlashCommandBuilder } from "discord.js";
import { Command } from "~src/models";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's current ping."),
  execute: async () => {},
};
