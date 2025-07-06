import { Logger } from '@nestjs/common';
import chalk from 'chalk';

export class CustomLogger extends Logger {
  log(message: string) {
    super.log(chalk.greenBright(`[INFO] ${message}`));
  }

  error(message: string) {
    super.error(chalk.redBright(`[ERROR] ${message}`));
  }

  warn(message: string) {
    super.warn(chalk.yellowBright(`[WARN] ${message}`));
  }
}
