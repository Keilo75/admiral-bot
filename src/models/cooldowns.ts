import { Command } from "./command";

type CooldownState =
  | {
      canExecute: true;
    }
  | {
      canExecute: false;
      remainingTime: number;
    };

export class Cooldowns {
  lastExecutedTimestamps: Map<string, number>;

  constructor() {
    this.lastExecutedTimestamps = new Map();
  }

  getCooldownState(command: Command): CooldownState {
    if (!command.cooldown) return { canExecute: true };

    const lastExecuted = this.lastExecutedTimestamps.get(command.data.name);
    if (lastExecuted === undefined) return { canExecute: true };

    const timeSince = Date.now() - lastExecuted;
    if (timeSince < command.cooldown) {
      const remainingTime = command.cooldown - timeSince;
      return { canExecute: false, remainingTime };
    } else {
      return { canExecute: true };
    }
  }

  updateCooldowns(command: Command) {
    this.lastExecutedTimestamps.set(command.data.name, Date.now());
  }
}
