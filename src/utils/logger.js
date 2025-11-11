import chalk from 'chalk';
import axios from 'axios';

let panelUrl = null;
let panelSecret = null;
let simRigId = null;
let sendLogs = false;

export const configureLogger = (config) => {
    panelUrl = config.panelUrl;
    panelSecret = config.panelSecret;
    simRigId = config.simRigId;
    sendLogs = config.sendLogs === 'true';
};

const sendLogToPanel = async (level, message) => {
    if (!panelUrl || !panelSecret || !simRigId || !sendLogs) return;

    try {
        await axios.post(
            `${panelUrl}/v1/api/simrig/${simRigId}/logs`,
            {
                level,
                message,
                timestamp: Date.now()
            },
            {
                headers: {
                    'x-secret-key': panelSecret
                }
            }
        );
    } catch (error) {
    }
};

export const logInfo = msg => {
    console.log(`${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} ${chalk.cyanBright('[INFO]')} ${msg}`);
    sendLogToPanel('info', msg);
};

export const logSuccess = msg => {
    console.log(`${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} ${chalk.greenBright('[✓]')} ${msg}`);
    sendLogToPanel('success', msg);
};

export const logError = msg => {
    console.error(`${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} ${chalk.redBright('[ERROR]')} ${msg}`);
    sendLogToPanel('error', msg);
};

export const logWarning = msg => {
    console.warn(`${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} ${chalk.yellowBright('[WARNING]')} ${msg}`);
    sendLogToPanel('warning', msg);
};

export const logDebug = msg => {
    console.debug(`${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} ${chalk.yellow('[DEBUG]')} ${msg}`);
    sendLogToPanel('debug', msg);
};

export const logPanel = msg => {
    console.log(`${chalk.gray(`[${new Date().toLocaleTimeString()}]`)} ${chalk.magentaBright('[PANEL]')} ${msg}`);
    sendLogToPanel('panel', msg);
}
