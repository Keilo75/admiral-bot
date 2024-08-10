import { type Command } from "../models/command";
import { article } from "./article";
import { ping } from "./ping";
import { random } from "./random";

export const commands = new Map<string, Command>();
const addCommandsToMap = (...commandsToAdd: Command[]) => {
  commandsToAdd.forEach((c) => commands.set(c.data.name, c));
};

addCommandsToMap(ping, random, article);

// TODO: Search command
