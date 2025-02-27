# 🚀 Hono RestAPI Starter Kit

A modern, production-ready API starter kit built with cutting-edge technologies for rapid development and scalable
performance.

## ✨ Features

- **🔥 [Hono](https://hono.dev/)** - Ultra-fast web framework for the edge
- **🔐 Authentication & Authorization**
    - JWT token-based authentication
    - OAuth2 integration (Google, GitHub, etc.)
    - Email OTP verification
- **📊 Database Integration**
    - [Drizzle ORM](https://orm.drizzle.team/) - Type-safe SQL query builder
    - PostgreSQL - Reliable, open-source relational database
- **🗄️ Caching**
    - Redis for high-performance caching and session management
- **🐳 DevOps Ready**
    - Docker & Docker Compose for containerization
    - Ready for CI/CD integration
- **📝 API Documentation**
    - Auto-generated OpenAPI documentation
    - Interactive SwaggerUI interface

## 🛠️ Tech Stack

| Category             | Technologies                                         |
|----------------------|------------------------------------------------------|
| **Framework**        | [Hono](https://hono.dev/)                            |
| **Authentication**   | JWT, OAuth2, Email OTP                               |
| **Database**         | PostgreSQL, [Drizzle ORM](https://orm.drizzle.team/) |
| **Caching**          | Redis                                                |
| **Containerization** | Docker                                               |
| **Package Manager**  | [Bun](https://bun.sh/)                               |
| **Documentation**    | OpenAPI, SwaggerUI                                   |

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (1.0.0 or later)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/SyahrulBhudiF/Hono-Starter-Code
   cd Hono-Starter-Code
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🏃‍♂️ Running the Application

### Development Mode

Start the application and all required services (PostgreSQL, Redis) using Docker:

```bash
docker compose build
docker compose up
```

This will launch the development environment with hot reloading enabled.

### Production Mode

For production deployment, use the same Docker Compose setup with minor configuration adjustments at Dockerfile and
docker-compose.yml.

```bash
# Run in production mode
docker compose build --no-cache
docker compose up
```

## 📖 API Documentation

Once the application is running, you can access the API documentation at:

- **OpenAPI Documentation**: [http://localhost:3000/doc](http://localhost:3000/doc)
- **Swagger UI**: [http://localhost:3000/ui](http://localhost:3000/ui)

## 📁 Project Structure

```
├── src/
│   ├── drizzle/         # Drizzle ORM migration
|   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes and Swagger documentation
│   ├── services/        # Business logic
|   ├── types/           # Type definitions and Repository abstraction
│   ├── utils/           # Utility functions
|   ├── validation/      # Request validation schemas
│   └── index.ts         # App entry point
|   └── worker.ts        # Worker entry point
├── .env.example         # Environment variables example
├── compose.yml          # Docker Compose configuration
├── Dockerfile           # Docker configuration
├── drizzle.config.ts    # Drizzle ORM configuration
└── package.json         # Dependencies and scripts
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

