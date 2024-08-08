import chalk from "chalk";

type LogLevel = "info" | "error" | "trace";

export class Logger {
  constructor() {}

  public static info(message: unknown) {
    console.log(this.getLogPrefix("info") + message);
  }

  public static error(message: unknown, error?: unknown) {
    console.error(this.getLogPrefix("error") + message);
    if (error) console.error(error);
  }

  public static trace(message: unknown, trace: unknown) {
    console.log(this.getLogPrefix("trace") + message);
    console.log(trace);
  }

  private static getLogPrefix(level: LogLevel): string {
    const time = new Date();

    return `${chalk.gray(`[${time.toISOString()}]`)} ${this.getLogLevel(
      level
    )} `;
  }

  private static getLogLevel(level: LogLevel): string {
    switch (level) {
      case "info":
        return chalk.blue("[INFO]");

      case "error":
        return chalk.red("[ERROR]");

      case "trace":
        return chalk.magenta("[TRACE]");
    }
  }
}
