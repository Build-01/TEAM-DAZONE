# sabiwork Backend

This repository contains the backend for `sabiwork`, an AI-driven economic identity platform focused on monitored trust credit, pension automation, and informal economy inclusion.

## Run locally with Docker

1. Copy `.env.example` to `.env` and update secrets.
2. Build and start containers:

```bash
docker compose up --build
```

3. Open the backend at `http://localhost:3000`

## Docker setup

- `Dockerfile` builds the Node.js app and generates Prisma client.
- `docker-compose.yml` creates PostgreSQL, Redis, and the `sabiwork` app.

## Environment variables

Required values:

- `DATABASE_URL`
- `JWT_SECRET`
- `SQUAD_API_KEY`
- `SQUAD_WEBHOOK_SECRET`
- `REDIS_URL`
- `APP_NAME`
- `FRONTEND_URL`

## Host on a container platform

Use the `Dockerfile` to deploy on any Docker-friendly host such as:

- Render
- Railway
- Fly.io
- AWS ECS / Fargate
- DigitalOcean App Platform

For production, set environment variables in your host provider dashboard and remove local `.env` files from source control.
