import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import { type Context } from "./context";

type ExecuteArgs = {
  interaction: ChatInputCommandInteraction;
  context: Context;
};

export type Command = {
  data: SlashCommandBuilder;
  execute: (args: ExecuteArgs) => Promise<void>;
};
