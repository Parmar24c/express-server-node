import chalk from 'chalk';
import Constants from '../config/constants.js';

class Logger {
    static info(message) {
        if (Constants.ENV.SHOW_LOGS) {
            console.log(chalk.blue(`ℹ️  ${message}`));
        }
    }

    static success(message) {
        if (Constants.ENV.SHOW_LOGS) {
            console.log(chalk.green(`✅  ${message}`));
        }
    }

    static warn(message) {
        if (Constants.ENV.SHOW_LOGS) {
            console.log(chalk.yellow(`⚠️  ${message}`));
        }
    }

    static error(message) {
        if (Constants.ENV.SHOW_LOGS) {
            console.log(chalk.red(`❌  ${message}`));
        }
    }

    static request(req) {
        if (Constants.ENV.SHOW_LOGS) {
            console.log("-------------------------------------------------");
            console.log(chalk.magenta(`REQUEST: ${req.method} ${req.originalUrl}`));
        }
    }

    static response(status, message) {
        if (Constants.ENV.SHOW_LOGS) {
            switch (status) {
                case 400:
                case 401:
                case 403:
                    console.log(chalk.yellow(`⚠️  RESPONSE ${status}: ${message}`));
                    break;
                case 200:
                case 201:
                    console.log(chalk.green(`RESPONSE ${status}: ${message}`));
                    break;
                case 500:
                    console.log(chalk.red(`❌  RESPONSE ${status}: ${message}`));
                default:
                    console.log(chalk.red(`ℹ️  RESPONSE ${status}: ${message}`));

            }
            console.log("-------------------------------------------------\n");
        }
    }
}

export default Logger;
