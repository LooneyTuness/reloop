# Reloop Server Application

The backend API for the Reloop marketplace platform, built with NestJS and TypeScript.

## 🚀 Getting Started

For complete setup instructions, see the [**Root Setup Manual**](../SETUP_MANUAL.md).

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

The server will run on http://localhost:3001 (or the port specified in your environment).

## 📁 Project Structure

```
server/
├── src/
│   ├── app.controller.ts    # Main controller
│   ├── app.service.ts       # Main service
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── test/                    # E2E tests
├── dist/                    # Compiled TorchScript output
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
NODE_ENV=development
```

## 📦 Available Scripts

```bash
npm run start              # Start production server
npm run start:dev          # Start development server with watch mode
npm run start:debug        # Start in debug mode
npm run start:prod         # Start production server
npm run build              # Build application
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Test with coverage
npm run lint               # Lint code
npm run format             # Format code
```

## 🎨 Technologies

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type safety
- **Express** - HTTP server

## 📚 Documentation

- [NestJS Documentation](https://docs.nestjs.com)
- [Setup Manual](../SETUP_MANUAL.md) - Complete setup guide

## 🔒 Security

- Never commit `.env` files
- Keep API keys secure
- Follow security best practices

## 🤝 Contributing

1. Follow NestJS coding conventions
2. Write tests for new features
3. Run linting before committing: `npm run lint`
