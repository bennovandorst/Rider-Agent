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

Rider-Server connects to EA F1 games via UDP telemetry. It uses RabbitMQ for message queuing to ensure reliable data delivery.

## Features

- Real-time telemetry data from EA F1 games
- Support for multiple simulator rigs
- Message queuing with RabbitMQ
- Configurable ports and queues

## Architecture

Rider-Server consists of the following components:

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
SIMRIG_ID=1 # Set to 1 or 2 depending on the SimRig
UDP_PORT=20777
RABBITMQ_URI=amqp://username:password@localhost:5672
```

## Usage

1. Start the server using the launcher or npm:
   ```
   npm start
   ```

2. When prompted, select a SimRig (1 or 2)

3. The server will start listening for telemetry data and send it to the RabbitMQ queues.
