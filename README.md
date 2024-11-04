# 🔐 nest-auth

A robust authentication and authorization system built with NestJS, featuring JWT RS256 encryption and secure password handling.

## ✨ Features

- 🔒 Complete authentication system
- 👤 User management APIs
- 🔑 JWT RS256 encryption using public/private key pairs
- 🛡️ Secure password encryption with public/private keys
- 🚫 Role-based authorization
- 📝 TypeScript support
- 🎯 Clean architecture and best practices

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Authentication:** JWT (RS256)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/riteshporiya/nest-auth.git
cd nest-auth
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration:
- Database credentials
- JWT settings
- Public/Private key paths

4. Run migrations
```bash
npm run migration:run
# or
yarn migration:run
```

5. Start the application
```bash
# Development
npm run start:dev
# or
yarn start:dev
```

## 🔌 API Endpoints

- http://localhost:3000/api/docs/

## 🔒 Security Features

- JWT RS256 encryption for enhanced security
- Public/Private key encryption for passwords
- Role-based access control
- Protected routes with custom guards
- Request validation
- Rate limiting

## 🏗️ Architecture
- Custom Decorator: Uses a custom decorator to set rate limit metadata on routes.
- Interceptor: Implements an interceptor to set custom logs.
- Dependency Injection: Uses NestJS's dependency injection system and module structure.
- Reflector: Utilizes the Reflector to access metadata.
- HttpException: Throws a standard HttpException for rate limit errors.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or enhancements you would like to see.

Happy coding! 🎉