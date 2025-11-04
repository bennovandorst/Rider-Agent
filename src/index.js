import { CONFIG } from './config/config.js';
import { MessagingService } from './services/messagingService.js';
import { TelemetryService } from './services/telemetryService.js';
import { logError, logInfo } from './utils/logger.js';
import readline from 'readline';
import { constants } from '@z0mt3c/f1-telemetry-client';
import dotenv from "dotenv";
import figlet from "figlet";
import chalk from "chalk";

dotenv.config({quiet: true});
const { PACKETS } = constants;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const banner = await figlet.text("Rider Agent");
console.log(chalk.greenBright(banner));
console.log(chalk.dim('By Benno van Dorst - https://github.com/bennovandorst\n'));


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
        telemetry.on(packetKey, data => messaging.publish(simrigId, configQueue, data));
    });

    telemetry.start();

    process.on('SIGINT', () => {
        telemetry.stop();
        logInfo('\nGracefully shutting down...');
        rl.close();
        process.exit(0);
    });
}

const simRigId = process.env.SIMRIG_ID;
if (simRigId) {
    startSimRig(simRigId);
} else {
    rl.question('Which SimRig are we using? (1 or 2): ', startSimRig);
}
