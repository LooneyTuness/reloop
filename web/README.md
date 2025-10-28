# Reloop Web Application

The frontend application for the Reloop marketplace platform, built with Next.js 14 and TypeScript.

## 🚀 Getting Started

For complete setup instructions, see the [**Root Setup Manual**](../SETUP_MANUAL.md).

### Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   ├── contexts/               # React contexts
│   ├── lib/                    # Utility functions and configurations
│   │   └── supabase/          # Supabase client setup
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── .env.local                  # Environment variables (create from env.example)
├── env.example                 # Environment variables template
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json
```

## 🔧 Environment Variables

Create a `.env.local` file based on `env.example`:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_WAITLIST_ONLY=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Notifications (REQUIRED)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# PostHog Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

See [SETUP_MANUAL.md](../SETUP_MANUAL.md) for detailed setup instructions.

## 📦 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript type checking
npm run db:types         # Generate Supabase types
```

## 🎨 Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible UI components
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Query** - Server state management
- **Supabase** - Backend-as-a-Service

## 📚 Documentation

- [Setup Manual](../SETUP_MANUAL.md) - Complete setup guide
- [Environment Setup Guide](./ENVIRONMENT_SETUP_GUIDE.md) - Environment configuration
- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md) - Deployment instructions

## 🔒 Security

- Never commit `.env.local`
- Keep API keys secure
- Review security headers in `next.config.js`

## 🤝 Contributing

1. Follow the code style guidelines
2. Run linting before committing: `npm run lint:fix`
3. Ensure TypeScript checks pass: `npm run type-check`
