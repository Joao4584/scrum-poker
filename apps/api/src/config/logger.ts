import { ConsoleLogger } from '@nestjs/common';
import chalk from 'chalk';

export class CustomLogger extends ConsoleLogger {
  constructor(context?: string) {
    super(context, { timestamp: true });
  }

  log(message: any, context?: string) {
    super.log(chalk.greenBright(message), context);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(chalk.redBright(message), stack, context);
  }

  warn(message: any, context?: string) {
    super.warn(chalk.yellowBright(message), context);
  }

  debug(message: any, context?: string) {
    super.debug(chalk.blueBright(message), context);
  }

  verbose(message: any, context?: string) {
    super.verbose(chalk.magentaBright(message), context);
  }
}
