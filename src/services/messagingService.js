import amqp from 'amqplib';
import { logError, logSuccess } from '../utils/logger.js';

export class MessagingService {
    constructor(uri) {
        this.uri = uri;
        this.connections = {};
        this.channels = {};
        this.connectedPromises = {};
    }

    async connect(simRigId, queues = []) {
        if (this.connectedPromises[simRigId]) {
            return this.connectedPromises[simRigId];
        }

        this.connectedPromises[simRigId] = new Promise(async (resolve) => {
            const connectAndSetup = async () => {
                try {
                    const conn = await amqp.connect(this.uri);

                    conn.on('error', (err) => {
                        logError(`RabbitMQ error for SimRig: ${err.message}`);
                    });
                    conn.on('close', () => {
                        logError(`RabbitMQ closed for SimRig, reconnecting...`);
                        this.connectedPromises[simRigId] = null;
                        setTimeout(connectAndSetup, 5000);
                    });

                    const channel = await conn.createChannel();

                    for (const queue of queues) {
                        await channel.assertQueue(queue);
                        logSuccess(`Queue ensured [SimRig ${simRigId}] ${queue}`);
                    }

                    this.connections[simRigId] = conn;
                    this.channels[simRigId] = channel;

                    logSuccess(`Connected to RabbitMQ on ${this.uri}`);

                    resolve();
                } catch (err) {
                    logError(`RabbitMQ Connection Error: ${err.message}`);
                    setTimeout(connectAndSetup, 5000);
                }
            };

            await connectAndSetup();
        });

        return this.connectedPromises[simRigId];
    }

    publish(simRigId, queue, data) {
        const channel = this.channels[simRigId];
        if (!channel) {
            logError(`No RabbitMQ channel available for SimRig to publish to ${queue}`);
            return;
        }
        try {
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
        } catch (err) {
            logError(`Failed to publish message to ${queue}: ${err.message}`);
        }
    }
}
