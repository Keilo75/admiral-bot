import "../libs/i18n";

import { REST, Routes } from "discord.js";
import dotenv from "dotenv";

import { commands } from "../commands";
import { Logger } from "../utils";

dotenv.config();

const mode = process.env.MODE === "dev" ? "dev" : "prod";
Logger.info(`Registering commands in ${mode} mode.`);

const commandData = Array.from(commands.values()).map((c) => c.data.toJSON());
Logger.trace("Commands", commandData);

const postRequest = async () => {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  const route =
    mode === "dev"
      ? Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        )
      : Routes.applicationCommands(process.env.CLIENT_ID);

  try {
    Logger.info(`Registering ${commandData.length} commands.`);
    const data = await rest.put(route, { body: commandData });
    Logger.trace("API Response", data);
    Logger.info(`Successfully registered commands.`);
  } catch (err) {
    Logger.error("Unable to update application commands.", err);
  }
};

postRequest();
