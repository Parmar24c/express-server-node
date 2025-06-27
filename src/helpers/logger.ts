import chalk from 'chalk';
import Constants from '../config/constants.js';
import { Request } from 'express';

class Logger {
    static info(message: string) {
        if (Constants.ENV.SHOW_LOGS) {
            console.log(chalk.blue(`ℹ️  ${message}`));
        }
    }

    static success(message: string) {
        if (Constants.ENV.SHOW_LOGS) {
            console.log(chalk.green(`✅  ${message}`));
        }
    }

    static warn(message: string) {
        if (Constants.ENV.SHOW_LOGS) {
            console.log(chalk.yellow(`⚠️  ${message}`));
        }
    }

    static error(message: string) {
        if (Constants.ENV.SHOW_LOGS) {
            console.log(chalk.red(`❌  ${message}`));
        }
    }

    static request(req: Request) {
        if (Constants.ENV.SHOW_LOGS) {
            console.log("-------------------------------------------------");
            console.log(chalk.magenta(`➡️  REQUEST: ${req.method} ${req.originalUrl}`));
        }
    }

    static response(status: number, message: string) {
        if (Constants.ENV.SHOW_LOGS) {
            switch (status) {
                case 200:
                case 201:
                    console.log(chalk.green(`✅  RESPONSE ${status}: ${message}`));
                    break;
                case 400:
                case 401:
                case 403:
                    console.log(chalk.yellow(`⚠️  RESPONSE ${status}: ${message}`));
                    break;
                case 500:
                    console.log(chalk.red(`❌  RESPONSE ${status}: ${message}`));
                    break;
                default:
                    console.log(chalk.cyan(`ℹ️  RESPONSE ${status}: ${message}`));
                    break;
            }
            console.log("-------------------------------------------------\n");
        }
    }
}

export default Logger;
