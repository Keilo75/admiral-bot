import chalk from "chalk";

type LogLevel = "info";

export class Logger {
  constructor() {}

  public info(message: unknown) {
    console.log(this.getLogPrefix("info") + message);
  }

  private getLogPrefix(level: LogLevel): string {
    const time = new Date();

    return `${chalk.gray(`[${time.toISOString()}]`)} ${this.getLogLevel(
      level
    )} `;
  }

  private getLogLevel(level: LogLevel): string {
    switch (level) {
      case "info":
        return chalk.blue("[INFO]");
    }
  }
}
