import chalk from 'chalk';

export const logInfo = msg => console.log(`${chalk.cyanBright('[INFO]')} ${msg}`);
export const logSuccess = msg => console.log(`${chalk.greenBright('[✓]')} ${msg}`);
export const logError = msg => console.error(`${chalk.redBright('[ERROR]')} ${msg}`);