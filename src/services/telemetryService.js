import { F1TelemetryClient, constants } from '@z0mt3c/f1-telemetry-client';
import EventEmitter from 'events';
import dotenv from "dotenv";

const { PACKETS } = constants;

export class TelemetryService extends EventEmitter {
  constructor(port) {
      super();
      this.client = new F1TelemetryClient({ port: port, bigintEnabled: false });

    Object.values(PACKETS).forEach(packetType => {
      this.client.on(packetType, packet => this.emit(packetType, packet));
    });
  }

  start() {
    this.client.start();
  }

  stop() {
    this.client.stop();
  }
}
