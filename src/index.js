import { CONFIG } from './config/config.js';
import { MessagingService } from './services/messagingService.js';
import { TelemetryService } from './services/telemetryService.js';
import {logDebug, logError} from './utils/logger.js';
import readline from 'readline';
import { constants } from '@z0mt3c/f1-telemetry-client';
import dotenv from "dotenv";
import figlet from "figlet";
import chalk from "chalk";
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

dotenv.config({quiet: true});
const { PACKETS } = constants;
const isDev = process.env.DEV_MODE === 'true';
const require = createRequire(import.meta.url);
const gitRev = require('git-rev-sync');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


async function startSimRig(simrigId) {
    const simRigConfig = CONFIG.SIM_RIGS[simrigId];
    if (!simRigConfig) {
        logError('Invalid SimRig ID. Exiting.');
        rl.close();
        process.exit(1);
    }

    const telemetry = new TelemetryService(process.env.UDP_PORT);
    const messaging = new MessagingService(process.env.RABBITMQ_URI);

    const packetQueuePairs = Object.entries(PACKETS)
        .map(([packetKey, packetType]) => {
            const queueKey = packetKey.replace(/([A-Z])/g, l => l.toLowerCase());
            const configQueue = simRigConfig[`${queueKey}Queue`] || simRigConfig[`${packetKey[0].toLowerCase()}${packetKey.slice(1)}Queue`];
            return configQueue ? { packetType, packetKey, configQueue } : null;
        })
        .filter(Boolean);

    await messaging.connect(simrigId, packetQueuePairs.map(p => p.configQueue));

    packetQueuePairs.forEach(({ packetKey, configQueue }) => {
        telemetry.on(packetKey, data => {
            if (isDev) {
                logDebug(`[${simrigId}] ${packetKey} -> ${configQueue}`);
            }
            messaging.publish(simrigId, configQueue, data);
        });
    });

    telemetry.start();
}

const simRigId = process.env.SIMRIG_ID;
const branchSync = gitRev.branch();
const banner = await figlet.text("Rider Agent");


const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));

console.log(chalk.greenBright(banner));
const badge = isDev
    ? chalk.black.bgYellowBright.bold(' DEVELOPMENT MODE ' + chalk.white.bgBlack.bold(` ${packageJson.name}@${branchSync} `))
    : chalk.black.bgGreenBright.bold(` v${packageJson.version} ` + chalk.black.bgWhite.bold(` ${packageJson.name}@${branchSync} `));

console.log(' ' + badge + '\n');
console.log(chalk.dim('By Benno van Dorst - https://github.com/bennovandorst'));
console.log(chalk.gray('─────────────────────────────────────────────────────────'));

if (simRigId) {
    console.log(chalk.cyanBright(`🚀 Using SimRig ${simRigId}\n`));
    startSimRig(simRigId);
} else {
    rl.question(
        chalk.cyanBright(`\u2753  Which SimRig are we using? (1, 2, or 3)`),
        answer => {
            const id = (answer || '').trim();
            startSimRig(id);
        }
    );
}
