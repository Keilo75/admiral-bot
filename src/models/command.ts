import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import { type Context } from "./context";

type ExecuteArgs = {
  interaction: ChatInputCommandInteraction;
  context: Context;
};

export type Command = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (args: ExecuteArgs) => Promise<void>;
};
