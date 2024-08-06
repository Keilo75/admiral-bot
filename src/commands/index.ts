import { Command } from "../models";
import { ping } from "./ping";

export const commands = new Map<string, Command>();
addCommandsToMap(ping);

function addCommandsToMap(...commandsToAdd: Command[]) {
  commandsToAdd.forEach((c) => commands.set(c.data.name, c));
}
