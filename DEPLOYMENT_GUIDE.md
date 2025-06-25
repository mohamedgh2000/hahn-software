# Deployment Guide - Hahn Software CRUD Application

This guide provides step-by-step instructions for deploying the Hahn Software Product Management System in various environments.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher
- pnpm (recommended) or npm

### Step 1: Database Setup

1. Install and start PostgreSQL:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Windows
# Download and install from https://www.postgresql.org/download/windows/
```

2. Create database and user:
```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Create database and user
CREATE DATABASE hahn_crud_db;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE hahn_crud_db TO postgres;
\q
```

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Configure database connection in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hahn_crud_db
spring.datasource.username=postgres
spring.datasource.password=password
```

3. Build and run the backend:
```bash
# Build the project
mvn clean compile

# Run the application
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

### Step 3: Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend/hahn-frontend
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm run dev --host
# or
npm run dev -- --host
```

The frontend will be available at `http://localhost:5173`

## Docker Deployment

### Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher

### Step 1: Build and Run with Docker Compose

1. Clone the repository and navigate to the project root:
```bash
cd hahn-crud-app
```

2. Build and start all services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- Database: `localhost:5432`

### Step 2: Individual Container Deployment

#### Database Container
```bash
docker run -d \
  --name hahn-crud-db \
  -e POSTGRES_DB=hahn_crud_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:14-alpine
```

#### Backend Container
```bash
# Build the backend image
cd backend
docker build -t hahn-crud-backend .

# Run the backend container
docker run -d \
  --name hahn-crud-backend \
  --link hahn-crud-db:database \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/hahn_crud_db \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=password \
  -p 8080:8080 \
  hahn-crud-backend
```

#### Frontend Container
```bash
# Build the frontend image
cd frontend/hahn-frontend
docker build -t hahn-crud-frontend .

# Run the frontend container
docker run -d \
  --name hahn-crud-frontend \
  --link hahn-crud-backend:backend \
  -e VITE_API_BASE_URL=http://localhost:8080/api \
  -p 5173:5173 \
  hahn-crud-frontend
```

## Production Deployment

### AWS Deployment

#### Prerequisites
- AWS CLI configured
- Docker installed
- AWS ECR repository created

#### Step 1: Build and Push Images

1. Build and tag images:
```bash
# Backend
docker build -t hahn-crud-backend ./backend
docker tag hahn-crud-backend:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/hahn-crud-backend:latest

# Frontend
docker build -t hahn-crud-frontend ./frontend/hahn-frontend
docker tag hahn-crud-frontend:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/hahn-crud-frontend:latest
```

2. Push to ECR:
```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com

docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/hahn-crud-backend:latest
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/hahn-crud-frontend:latest
```

#### Step 2: Deploy with ECS

1. Create ECS task definition
2. Create ECS service
3. Configure Application Load Balancer
4. Set up RDS PostgreSQL instance

### Heroku Deployment

#### Backend Deployment

1. Create Heroku app:
```bash
heroku create hahn-crud-backend
```

2. Add PostgreSQL addon:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. Configure environment variables:
```bash
heroku config:set SPRING_PROFILES_ACTIVE=heroku
```

4. Deploy:
```bash
git subtree push --prefix=backend heroku main
```

#### Frontend Deployment

1. Create Heroku app:
```bash
heroku create hahn-crud-frontend
```

2. Add Node.js buildpack:
```bash
heroku buildpacks:set heroku/nodejs
```

3. Configure environment variables:
```bash
heroku config:set VITE_API_BASE_URL=https://hahn-crud-backend.herokuapp.com/api
```

4. Deploy:
```bash
git subtree push --prefix=frontend/hahn-frontend heroku main
```

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/hahn_crud_db` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `password` |
| `SERVER_PORT` | Server port | `8080` |
| `SERVER_ADDRESS` | Server bind address | `0.0.0.0` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate DDL mode | `create-drop` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` |

### Production Environment Variables

Create a `.env.production` file for production settings:

```bash
# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db-host:5432/hahn_crud_db
SPRING_DATASOURCE_USERNAME=prod_user
SPRING_DATASOURCE_PASSWORD=secure_password
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_PROFILES_ACTIVE=production

# Frontend
VITE_API_BASE_URL=https://api.hahnsoftware.com/api
```

## Health Checks

### Backend Health Check
```bash
curl -f http://localhost:8080/api/products
```

### Frontend Health Check
```bash
curl -f http://localhost:5173
```

### Database Health Check
```bash
pg_isready -h localhost -p 5432 -U postgres
```

## SSL/TLS Configuration

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Monitoring and Logging

### Application Logs

Backend logs are available at:
- Development: Console output
- Production: `/var/log/hahn-crud-backend/`

### Database Monitoring

Monitor PostgreSQL performance:
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size('hahn_crud_db'));

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
pg_dump -h localhost -U postgres hahn_crud_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -h localhost -U postgres hahn_crud_db < backup_20250625_203000.sql
```

### Automated Backup Script

```bash
#!/bin/bash
BACKUP_DIR="/backups"
DB_NAME="hahn_crud_db"
DB_USER="postgres"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump -h localhost -U $DB_USER $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

## Troubleshooting

### Common Issues

#### Backend Won't Start

1. Check Java version:
```bash
java -version
```

2. Check database connection:
```bash
psql -h localhost -U postgres -d hahn_crud_db
```

3. Check application logs for errors

#### Frontend Build Fails

1. Clear node modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Check Node.js version:
```bash
node --version
npm --version
```

#### Database Connection Issues

1. Check PostgreSQL service status:
```bash
sudo systemctl status postgresql
```

2. Check database configuration:
```bash
sudo -u postgres psql -c "SELECT version();"
```

3. Verify network connectivity:
```bash
telnet localhost 5432
```

### Performance Optimization

#### Backend Optimization

1. Configure JVM heap size:
```bash
export JAVA_OPTS="-Xms512m -Xmx2g"
```

2. Enable connection pooling:
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

#### Frontend Optimization

1. Enable gzip compression in Nginx
2. Configure CDN for static assets
3. Implement lazy loading for components

## Security Considerations

### Production Security Checklist

- [ ] Change default database passwords
- [ ] Enable SSL/TLS encryption
- [ ] Configure firewall rules
- [ ] Implement rate limiting
- [ ] Enable CORS restrictions
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] Environment variable security

### Security Headers

Configure security headers in Nginx:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## Support

For deployment support and questions, please contact the Hahn Software development team or create an issue in the repository.

