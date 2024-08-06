import chalk from "chalk";

export class Logger {
  constructor() {}

  public info(message: unknown) {
    console.log(chalk.blue("[INFO] ") + this.getLogPrefix() + message);
  }

  private getLogPrefix(): string {
    const time = new Date();
    return chalk.gray`[${time.toISOString()}] `;
  }
}
