# Server

NestJS backend server with PostgreSQL and MinIO (S3-compatible storage).

## Prerequisites

- Docker and Docker Compose
- Node.js 20+

## Services

- **PostgreSQL**: Database server on port 10001
- **MinIO**: S3-compatible object storage
  - API: http://localhost:10002
  - Console: http://localhost:10003
  - Default credentials: minioadmin/minioadmin

## Getting Started

1. Start the services:
   ```bash
   docker-compose up -d
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Copy `.env.example` to `.env` and adjust the values as needed.

## Useful Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d bisim

# Remove all data (volumes)
docker-compose down -v
```