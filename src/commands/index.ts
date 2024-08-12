import { type Command } from "../models/command";
import { about } from "./about";
import { article } from "./article";
import { ping } from "./ping";
import { random } from "./random";
import { refetch } from "./refetch";
import { search } from "./search";

export const commands = new Map<string, Command>();
const addCommandsToMap = (...commandsToAdd: Command[]) => {
  commandsToAdd.forEach((c) => commands.set(c.data.name, c));
};

addCommandsToMap(ping, random, article, search, about, refetch);
