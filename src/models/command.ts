import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import { type Context } from "./context";

type Args<I> = {
  interaction: I;
  context: Context;
};

export type Command = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  cooldown?: number;
  execute: (args: Args<ChatInputCommandInteraction>) => Promise<void>;
  autocomplete?: (args: Args<AutocompleteInteraction>) => Promise<void>;
};
