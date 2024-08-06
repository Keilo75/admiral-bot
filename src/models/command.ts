import { type SlashCommandBuilder } from "discord.js";

export type Command = {
  data: SlashCommandBuilder;
  execute: () => Promise<void>;
};
