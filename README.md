# Reloop - Second-hand Marketplace Platform

A modern e-commerce platform for buying and selling second-hand items, built with Next.js, NestJS, and Supabase.

## 🚀 Quick Start

For detailed setup instructions, see the [**Setup Manual**](SETUP_MANUAL.md).

```bash
# Clone the repository
git clone <repository-url>
cd reloop

# Install all dependencies
npm run install:all

# Set up environment variables (see SETUP_MANUAL.md)
# Copy web/env.example to web/.env.local and configure

# Start the development server
npm run dev
```

Visit http://localhost:3000 to see the application.

## 📁 Project Structure

```
reloop/
├── web/              # Next.js frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   ├── env.example   # Environment variables template
│   └── package.json
├── server/           # NestJS backend server
│   ├── src/          # Source code
│   ├── test/         # E2E tests
│   └── package.json
├── SETUP_MANUAL.md   # Complete setup guide
├── package.json      # Root package.json with scripts
└── README.md
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **TanStack Query** - Data fetching

### Backend

- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Supabase** - Database and authentication

### Infrastructure

- **Supabase** - PostgreSQL database, authentication, storage
- **PostHog** - Analytics (optional)

## 📦 Available Scripts

### Root Level

```bash
npm run dev              # Start web development server
npm run dev:server       # Start server development server
npm run build            # Build web application
npm run build:server     # Build server application
npm run start            # Start web in production mode
npm run start:server     # Start server in production mode
npm run lint             # Lint web application
npm run install:all      # Install all dependencies
```

### Web Application

```bash
cd web
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
npm run db:types         # Generate Supabase types
```

### Server Application

```bash
cd server
npm run start:dev        # Start development server
npm run build            # Build application
npm run start:prod       # Start production server
跟他 run test             # Run tests
npm run test:e2e         # Run end-to-end tests
```

## 🔧 Environment Setup

1. Copy the environment template:

   ```bash
   cd web
   cp env.example .env.local
   ```

2. Configure your environment variables (see [SETUP_MANUAL.md](SETUP_MANUAL.md) for details):

   - Supabase credentials
   - Email configuration
   - Optional: PostHog analytics

3. Set up your Supabase database (see [SETUP_MANUAL.md](SETUP_MANUAL.md))

## 📚 Documentation

- [**Setup Manual**](SETUP_MANUAL.md) - Complete setup guide for new developers
- [**Web Documentation**](web/README.md) - Frontend-specific documentation
- [**Server Documentation**](server/README.md) - Backend-specific documentation
- [**Environment Setup Guide**](web/ENVIRONMENT_SETUP_GUIDE.md) - Environment configuration
- [**Production Deployment Guide**](web/PRODUCTION_DEPLOYMENT_GUIDE.md) - Production deployment

## 🔒 Security

- Never commit `.env.local` or `.env` files
- Keep all API keys and credentials secure
- Use different credentials for development and production
- Review and update security policies regularly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For setup issues, refer to the [Setup Manual](SETUP_MANUAL.md) or check the troubleshooting section.

---

**Happy coding! 🚀**
