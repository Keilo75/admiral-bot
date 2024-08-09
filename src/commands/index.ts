import { type Command } from "../models/command";
import { ping } from "./ping";
import { randomArticle } from "./random-article";

export const commands = new Map<string, Command>();
const addCommandsToMap = (...commandsToAdd: Command[]) => {
  commandsToAdd.forEach((c) => commands.set(c.data.name, c));
};

addCommandsToMap(ping, randomArticle);
