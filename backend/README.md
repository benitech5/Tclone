# Orbixa Backend

A real-time messaging and communication platform built with Spring Boot, WebSocket, and Redis.

## 🚀 Features

- **Real-time Messaging**: WebSocket-based instant messaging
- **User Authentication**: JWT-based authentication with OTP verification
- **Contact Management**: Add, remove, and manage contacts
- **Group Chats**: Create and manage group conversations
- **File Sharing**: Upload and share media files
- **Voice/Video Calls**: WebRTC-based calling functionality
- **Presence System**: Online/offline status and typing indicators
- **Message Reactions**: React to messages with emojis
- **Message Search**: Search through chat history
- **User Settings**: Customizable user preferences
- **Push Notifications**: Real-time notifications

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Authentication**: JWT
- **Real-time**: WebSocket (STOMP)
- **File Storage**: Local file system
- **Testing**: JUnit 5, Mockito, TestContainers
- **Documentation**: OpenAPI 3 (Swagger)
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 15
- Redis 7
- Docker (optional)

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd orbixa/backend
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - H2 Console (test): http://localhost:8080/h2-console

### Manual Setup

1. **Set up PostgreSQL**
   ```sql
   CREATE DATABASE orbixa;
   CREATE USER orbixa_user WITH PASSWORD 'orbixa_password';
   GRANT ALL PRIVILEGES ON DATABASE orbixa TO orbixa_user;
   ```

2. **Set up Redis**
   ```bash
   redis-server
   ```

3. **Configure application**
   ```bash
   cp src/main/resources/application.yml.example src/main/resources/application.yml
   # Edit the configuration file with your database and Redis settings
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

## 🧪 Testing

### Run all tests
```bash
mvn test
```

### Run specific test categories
```bash
# Unit tests only
mvn test -Dtest=*Test

# Integration tests only
mvn test -Dtest=*IntegrationTest

# API tests only
mvn test -Dtest=*ApiTest
```

### Run with coverage
```bash
mvn clean test jacoco:report
```

## 📚 API Documentation

Once the application is running, you can access:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/orbixa` |
| `DATABASE_USERNAME` | Database username | `orbixa_user` |
| `DATABASE_PASSWORD` | Database password | `orbixa_password` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRATION` | JWT expiration time (ms) | `86400000` |
| `FILE_UPLOAD_PATH` | File upload directory | `/app/uploads` |

### Profiles

- **dev**: Development configuration with H2 database
- **test**: Testing configuration with H2 database
- **prod**: Production configuration with PostgreSQL
- **docker**: Docker-specific configuration

## 🏗️ Project Structure

```
src/
├── main/
│   ├── java/com/qwadwocodes/orbixa/
│   │   ├── features/
│   │   │   ├── auth/          # Authentication & authorization
│   │   │   ├── chat/          # Chat & messaging
│   │   │   ├── contacts/      # Contact management
│   │   │   ├── profile/       # User profiles
│   │   │   ├── settings/      # User settings
│   │   │   ├── search/        # Search functionality
│   │   │   ├── other/         # OTP, presence, etc.
│   │   │   └── websocket/     # WebSocket handling
│   │   ├── config/            # Configuration classes
│   │   └── security/          # Security configuration
│   └── resources/
│       ├── application.yml    # Main configuration
│       └── db/migration/      # Database migrations
└── test/
    ├── java/                  # Test classes
    └── resources/
        ├── application-test.yml
        └── data.sql           # Test data
```

## 🔐 Security

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

## 📊 Monitoring

- Health check endpoint: `/actuator/health`
- Metrics endpoint: `/actuator/metrics`
- Application info: `/actuator/info`

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t orbixa-backend .

# Run container
docker run -p 8080:8080 orbixa-backend
```

### Kubernetes Deployment
```bash
kubectl apply -f k8s/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@orbixa.com
- Documentation: https://docs.orbixa.com 