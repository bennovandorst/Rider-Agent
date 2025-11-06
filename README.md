# Rider-Agent

Sends telemetry data from SimRig to RabbitMQ

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Overview

Rider Agent connects to EA F1 games via UDP telemetry. It uses RabbitMQ for message queuing to ensure reliable data delivery.

## Features

- Real-time telemetry data from EA F1 games
- Support for multiple simulator rigs
- Message queuing with RabbitMQ
- Configurable ports and queues

## Architecture

Rider-Agent consists of the following components:

1. **Telemetry Service**: Connects to EA F1 games via UDP and receives telemetry data
2. **Messaging Service**: Handles communication with RabbitMQ for message queuing

The data flow is as follows:

```
EA F1 Game (UDP) → Rider-Agent → Messaging Service (RabbitMQ) → Rider-Server → Rider Application
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Git](https://git-scm.com/) (for updates)

## Installation

### Windows

1. Clone the repository:
   ```
   git clone https://github.com/bennovandorst/Rider-Agent.git C:\Rider-Agent
   ```

2. Install dependencies:
   ```
   cd C:\Rider-Agent
   npm install
   ```

3. Run the launcher:
   ```
   launcher.bat
   ```

### macOS/Linux

1. Clone the repository:
   ```
   git clone https://github.com/bennovandorst/Rider-Agent.git
   cd Rider-Agent
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the agent:
   ```
   npm start
   ```

## Configuration

The configuration for the queues is defined in `src/config/config.js`:

`.env`:
```env
SIMRIG_ID=1 # Set to 1, 2 or 3 depending on the SimRig
UDP_PORT=20777 # Port defined in EA F1 game settings
RABBITMQ_IP=localhost # IP address of the RabbitMQ server
RABBITMQ_PORT=5672 # Port of the RabbitMQ server
RABBITMQ_USER=guest # RabbitMQ username
RABBITMQ_PASSWORD=guest # RabbitMQ password
RABBITMQ_VHOST=/ # RabbitMQ virtual host
PANEL_URL=http://localhost:3000 # URL of the Rider Agent Panel remove if not used
PANEL_SECRET=your_panel_secret # Secret for the Rider Agent Panel remove if not used
SEND_LOGS=true # Set to true to send logs to the Rider Agent Panel (suggestion: set to false if development mode is enabled)
DEV_MODE=false # Set to true to enable development mode
```

## Usage

1. Start the server using the launcher or npm:
   ```
   npm start
   ```

2. If prompted, select a SimRig (1, 2 or 3)

3. The server will start listening for telemetry data and send it to the RabbitMQ queues.

### Adding Rider-Agent to Steam Advanced Launch Options

1. Open Steam → Library → Right-click **EA F1** → Properties → Launch Options.

2. Add the following line:

   ```
   cmd.exe /k "C:\Rider-Agent\launcher.bat" %command%
   ```

3. Close the properties window and launch the game.
