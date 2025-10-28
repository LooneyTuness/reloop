# Reloop Project Setup Manual

This guide will help you set up the Reloop project on your local machine after cloning the repository.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **A Supabase account** - [Sign up](https://supabase.com/)

## 🏗️ Project Structure

This is a monorepo containing:

```
reloop/
├── web/          # Next.js frontend application
├── server/       # NestJS backend server
├── package.json  # Root package.json with scripts
└── README.md
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd reloop
```

### 2. Install Dependencies

Install dependencies for all parts of the project:

```bash
npm run install:all
```

This command will install dependencies for:

- Root directory
- Web application
- Server application

**Alternative:** If you prefer to install manually:

```bash
# Install root dependencies
npm install

# Install web dependencies
cd web
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### 3. Set Up Environment Variables

#### For Web Application

1. Navigate to the `web` directory:

```bash
cd web
```

2. Copy the environment example file:

```bash
cp env.example .env.local
```

3. Edit `.env.local` with your configuration:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_WAITLIST_ONLY=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Notifications (REQUIRED for full functionality)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# PostHog Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Environment
NODE_ENV=development
```

#### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

#### Setting Up Email Notifications

For email functionality, you'll need a Gmail App Password:

1. Enable 2-Step Verification on your Google Account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use your Gmail address and the generated password in `.env.local`

#### For Server Application (Optional)

If you need to run the NestJS server:

```bash
cd server
```

Create a `.env` file:

```env
PORT=3001
NODE_ENV=development
```

## 🗄️ Database Setup

### Option 1: Using Supabase Dashboard (Recommended for Beginners)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor**
3. Navigate to the `web` directory in your project
4. Look for SQL files that need to be executed, such as:
   - `setup-production-schema.sql`
   - `database-migration.sql`
5. Copy and paste the SQL into the Supabase SQL Editor
6. Run the SQL scripts in order

**Key SQL files to run:**

- `database-migration.sql` - Main database schema
- Any other migration files in the `web` directory as needed

### Option 2: Using Supabase CLI (Advanced)

1. Install Supabase CLI:

```bash
npm install -g supabase
```

2. Initialize Supabase in your project:

```bash
cd web
supabase init
```

3. Link to your project:

```bash
supabase link --project-ref your-project-id
```

4. Generate TypeScript types:

```bash
supabase gen types typescript --local > src/lib/supabase/supabase.types.ts
```

## 🎨 Running the Development Server

### Web Application (Frontend)

From the root directory:

```bash
npm run dev
```

Or from the `web` directory:

```bash
cd web
npm run dev
```

The application will be available at:

- **Web App**: http://localhost:3000
- **Server**: http://localhost: Interpretation

### Server Application (Backend)

From the root directory:

```bash
npm run dev:server
```

Or from the `server` directory:

```bash
cd server
npm run start:dev
```

## 📜 Available Scripts

### Root Directory Scripts

```bash
# Development
npm run dev              # Start web development server
npm run dev:server       # Start server development server

# Build
npm run build            # Build web application
npm run build:server     # Build server application

# Production
npm run start            # Start web in production mode
npm run start:server     # Start server in production mode

# Linting
npm run lint             # Lint web application

# Install
npm run install:all      # Install all dependencies
```

### Web Directory Scripts

```bash
cd web

npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript type checking
npm run db:types         # Generate Supabase types
```

### Server Directory Scripts

```bash
cd server

npm run start:dev        # Start development server
npm run build            # Build application
npm run start:prod       # Start production server
npm run test             # Run tests
npm run test:e2e         # Run end-to-end tests
```

## ✅ Verification Checklist

After setup, verify that:

- [ ] Dependencies installed successfully (no errors)
- [ ] Environment variables are set correctly
- [ ] Database schema is created in Supabase
- [ ] Development server starts without errors
- [ ] You can access http://localhost:3000
- [ ] No console errors in the browser

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process using port 3000
# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

Or use a different port:

```bash
cd web
PORT=3001 npm run dev
```

#### 2. Missing Environment Variables

If you see errors about missing environment variables:

1. Check that `.env.local` exists in the `web` directory
2. Verify all required variables are set
3. Restart the development server

#### 3. Database Connection Errors

If you see Supabase connection errors:

1. Verify your Supabase credentials in `.env.local`
2. Check that your Supabase project is active
3. Ensure the database schema has been set up
4. Check Supabase dashboard for any service issues

#### 4. Module Not Found Errors

If you see "Cannot find module" errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf web/node_modules web/package-lock.json
rm -rf server/node_modules server/package-lock.json

# Reinstall
npm run install:all
```

#### 5. TypeScript Errors

If you see TypeScript errors:

```bash
cd web
npm run type-check
```

Regenerate types if needed:

```bash
npm run db:types
```

## 🔒 Security Notes

- **Never commit `.env.local`** to version control
- Keep your Supabase service role key secure
- Don't share API keys or credentials publicly
- Use different credentials for development and production

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. Check the project's existing documentation files in the `web` directory
2. Review error messages carefully
3. Check the browser console and terminal for detailed error logs
4. Ensure all prerequisites are installed and up to date

## 🎯 Next Steps

After successful setup:

1. Explore the codebase structure
2. Read the project-specific documentation
3. Start contributing to the project
4. Review the deployment guides if deploying to production

---

**Happy Coding! 🚀**
