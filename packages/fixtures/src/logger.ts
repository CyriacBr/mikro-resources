import chalk from 'chalk';

export class Logger {
  error(msg: string, ...context: any[]) {
    console.log(`${chalk.red('[FixturesFactory]')} - ${msg}`);
    if (context && context.length > 0) {
      console.log('Provided context: ', context);
    }
    throw new Error(msg);
  }
}
