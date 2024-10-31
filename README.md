# Messenger App

## Description

A messaging application built with NestJS, PostgreSQL, Docker, and RabbitMQ, implementing a microservices architecture.

## Features

- Microservices Architecture
- Real-time messaging
- User Authentication
- Message queuing with RabbitMQ
- Containerized with Docker

## Tech Stack

- **Backend Framework:** NestJS
- **Message Broker:** RabbitMQ
- **Containerization:** Docker
- **Database:** PostgreSQL

## Prerequisites

Make sure you have the following installed:

- Node.js (v16 or higher)
- Docker & Docker Compose
- npm or yarn
- PostgreSQL

## Installation

### Clone repository

```bash
git clone https://github.com/Ejay02/messanger_app.git
cd [project-name]
```

### Install dependencies

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# RabbitMQ Configuration
RABBITMQ_DEFAULT_USER=
RABBITMQ_DEFAULT_PASS=
RABBITMQ_USER=
RABBITMQ_PASS=
RABBITMQ_HOST=
RABBITMQ_AUTH_QUEUE=

# PostgreSQL Configuration
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_HOST=
POSTGRES_PORT=5432

# Pgadmin Config
PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
```

## Running the Application

### Docker Setup

Start all services using Docker Compose:

```bash
docker-compose up
```

### Manual Startup

Important: Always start microservices before the API gateway.

1. Start the Auth microservice:

```bash
npm run start:dev auth
```

2. Start the API gateway:

```bash
npm run start:dev api
```

## Docker Services

- RabbitMQ
- [Other services to be added]

## API Endpoints

[To be added as the project progresses]

## Testing

[To be added as the project progresses]

## Documentation

[To be added as the project progresses]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Nest is [MIT licensed](LICENSE).
