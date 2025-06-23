# 🏪 Store Management System

> **🇺🇸 English** | **[🇻🇳 Tiếng Việt](README.md)** | **[🤝 Contributing](CONTRIBUTING_EN.md)** | **[📝 Changelog](CHANGELOG_EN.md)**

A modern store management system built with **Next.js 15** and **Supabase**, featuring multilingual support (Vietnamese/English) with a user-friendly interface and high performance.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.50.0-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Setup](#️-environment-setup)
- [📚 Usage Guide](#-usage-guide)
- [🛠️ Development](#️-development)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [❓ Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)

## ✨ Key Features

### 🎯 Comprehensive Management
- **📦 Product Management**: Add, edit, delete products with variants (colors, sizes, etc.)
- **🛒 Order Management**: Track order status, purchase history
- **👥 Customer Management**: Customer information, contacts, transaction history
- **🏬 Store Management**: Store information, branches
- **📂 Category Management**: Organize products by categories

### 🌐 Multilingual Support
- **🇻🇳 Vietnamese**: Complete Vietnamese interface
- **🇺🇸 English**: Full English support
- **🔄 Dynamic Switching**: Real-time language switching

### 🎨 Modern Interface
- **📱 Responsive Design**: Optimized for all devices
- **🌙 Dark/Light Mode**: Theme switching (ready to implement)
- **⚡ Performance**: Fast loading with Next.js 15 and Turbopack
- **🎭 Animation**: Smooth effects with Framer Motion

## 🛠️ Tech Stack

### 🏗️ Core Framework
- **[Next.js 15](https://nextjs.org/)**: React framework with App Router
- **[React 19](https://react.dev/)**: Latest React version
- **[TypeScript](https://www.typescriptlang.org/)**: Type safety and developer experience

### 🗄️ Database & Backend
- **[Supabase](https://supabase.com/)**: PostgreSQL database, Authentication, Real-time
- **[Supabase JS](https://supabase.com/docs/reference/javascript)**: JavaScript Client SDK

### 🎨 UI & Styling
- **[Tailwind CSS 4](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)**: Headless UI components
- **[Lucide React](https://lucide.dev/)**: Beautiful icons
- **[Framer Motion](https://www.framer.com/motion/)**: Animation library

### 📝 Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)**: Performant forms
- **[Zod](https://zod.dev/)**: Schema validation
- **[Hookform Resolvers](https://github.com/react-hook-form/resolvers)**: Form validation integration

### 🔄 State Management
- **[TanStack Query](https://tanstack.com/query)**: Server state management
- **[Zustand](https://zustand-demo.pmnd.rs/)**: Client state management

### 🌐 Internationalization
- **[Next-Intl](https://next-intl-docs.vercel.app/)**: i18n for Next.js

### 🧪 Testing & Quality
- **[Jest](https://jestjs.io/)**: Testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)**: Component testing
- **[ESLint](https://eslint.org/)**: Code linting
- **[Prettier](https://prettier.io/)**: Code formatting
- **[Husky](https://typicode.github.io/husky/)**: Git hooks

## 📁 Project Structure

```
nextjs-supabase-app/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📁 [locale]/                 # Internationalization routes
│   │   ├── 📁 auth/                 # Authentication pages
│   │   ├── 📁 dashboard/            # Dashboard page
│   │   ├── 📁 products/             # Product management
│   │   ├── 📁 orders/               # Order management
│   │   ├── 📁 customers/            # Customer management
│   │   ├── 📁 stores/               # Store management
│   │   ├── 📁 categories/           # Category management
│   │   └── layout.tsx               # Locale layout
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page
│
├── 📁 components/                   # Reusable components
│   ├── 📁 ui/                       # UI components
│   │   ├── Button.tsx               # Custom button component
│   │   ├── Modal.tsx                # Modal component
│   │   ├── Card.tsx                 # Card component
│   │   ├── Input.tsx                # Input component
│   │   ├── CustomSelect.tsx         # Select component
│   │   └── ...                      # Other UI components
│   └── 📁 layout/                   # Layout components
│       ├── DashboardLayout.tsx      # Dashboard layout
│       ├── Header.tsx               # Header component
│       └── Sidebar.tsx              # Sidebar component
│
├── 📁 lib/                          # Utilities and configurations
│   ├── supabaseClient.ts            # Supabase client setup
│   ├── utils.ts                     # Utility functions
│   └── colors.ts                    # Color system
│
├── 📁 hooks/                        # Custom React hooks
│   ├── index.ts                     # Hook exports
│   ├── useButtonLoading.ts          # Button loading hook
│   └── useConfirmation.ts           # Confirmation hook
│
├── 📁 types/                        # TypeScript type definitions
│   └── index.ts                     # Type exports
│
├── 📁 messages/                     # Internationalization messages  
│   ├── en.json                      # English translations
│   └── vi.json                      # Vietnamese translations
│
├── 📁 i18n/                         # i18n configuration
│   ├── routing.ts                   # Routing configuration
│   └── request.ts                   # Request configuration
│
├── 📁 migrations/                   # Database migrations
│   ├── add_contact_fields_to_customers.sql
│   └── add_status_to_orders.sql
│
├── 📁 public/                       # Static files
│
├── package.json                     # Dependencies and scripts
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── next.config.js                   # Next.js configuration
└── README.md                        # Documentation (this file)
```

## 🚀 Getting Started

### 📋 System Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 or **yarn**: >= 1.22.0
- **Git**: Latest version

### 🔽 Step 1: Clone Repository

```bash
# Clone the project from GitHub
git clone https://github.com/your-username/nextjs-supabase-app.git

# Navigate to project directory
cd nextjs-supabase-app
```

### 📦 Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm (recommended)
pnpm install
```

### ⚙️ Step 3: Environment Configuration

Create `.env.local` from the example file:

```bash
# Copy environment example
cp .env.example .env.local
```

Edit `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database URL (optional - for migrations)
DATABASE_URL=your_database_connection_string

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Store Management System"

# Other configurations
NEXT_PUBLIC_DEFAULT_LOCALE=vi
```

### 🗄️ Step 4: Database Setup

#### 4.1 Create Supabase Project

1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Get `Project URL` and `anon key` from Settings > API

#### 4.2 Run Migrations

```bash
# Run migration files in the migrations/ folder
# You can run them directly in Supabase SQL Editor
```

### 🏃‍♂️ Step 5: Run Application

```bash
# Development mode with Turbopack
npm run dev

# Or
yarn dev

# Or
pnpm dev
```

The application will run at: **http://localhost:3000**

## ⚙️ Environment Setup

### 🔑 Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default language | `vi` or `en` |

### 🛠️ Supabase Configuration

1. **Authentication**: Enable email authentication
2. **Database**: Create tables according to schema
3. **Storage**: Configure bucket for file uploads (if needed)
4. **RLS Policies**: Configure Row Level Security

## 📚 Usage Guide

### 🏠 Dashboard

After running the application, visit `/dashboard` to see the system overview:

- **📊 Statistics**: Total products, orders, customers
- **🔄 Recent Activity**: Track latest changes
- **📈 Charts**: Data analysis (coming soon)

### 📦 Product Management

- **Add Products**: Name, description, price, images
- **Variants**: Add color, size variations
- **Categories**: Organize products by category
- **Inventory**: Manage stock levels

### 🛒 Order Management

- **Create Orders**: Select products, customers
- **Status**: Processing, Delivered, Cancelled
- **Payment**: Track payment status

### 👥 Customer Management

- **Personal Info**: Name, email, phone
- **Address**: Delivery addresses
- **History**: Purchase history

## 🛠️ Development

### 📝 Available Scripts

```bash
# Development
npm run dev              # Run development server with Turbopack
npm run build           # Build production
npm run start           # Run production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check format
npm run type-check      # Check TypeScript

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Git & Commits
npm run prepare         # Setup Husky hooks
npm run commit          # Commit with Commitizen
```

### 🔧 IDE Configuration

#### Visual Studio Code

Install recommended extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

#### Settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "\"([^\"]*)\""]
  ]
}
```

### 🏗️ Component Structure

```tsx
// components/ui/Example.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExampleProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export function Example({ 
  variant = 'primary', 
  children, 
  className 
}: ExampleProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div 
      className={cn(
        'base-styles',
        variant === 'primary' && 'primary-styles',
        variant === 'secondary' && 'secondary-styles',
        className
      )}
    >
      {children}
    </div>
  );
}
```

### 🎨 Color System

Use the color system defined in `lib/colors.ts`:

```tsx
import { beverageColors } from '@/lib/colors';

// Use in component
<div className={beverageColors.primary.bg}>
  Content
</div>
```

## 🧪 Testing

### 🧪 Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 📝 Writing Tests

```tsx
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('secondary-class');
  });
});
```

### 🔍 E2E Tests (Coming Soon)

```bash
# Will add Playwright or Cypress
npm run test:e2e
```

## 🚀 Deployment

### 🌍 Vercel (Recommended)

1. **Push code to GitHub**
2. **Connect to Vercel**:
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Import repository
   - Configure environment variables
3. **Deploy**: Vercel will auto-deploy

### 🐳 Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build and run Docker
docker build -t store-management .
docker run -p 3000:3000 store-management
```

### ⚙️ Production Environment Variables

```env
# Production Environment
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=your_production_database_url
```

## ❓ Troubleshooting

### 🐛 Common Issues

#### 1. **Supabase Connection Error**

```
Error: Invalid Supabase URL or Key
```

**Solution**:
- Check `.env.local` file
- Ensure URL and key are correct
- Restart development server

#### 2. **TypeScript Error**

```
Type error: Cannot find module '@/lib/utils'
```

**Solution**:
- Check `tsconfig.json` paths
- Restart TypeScript server in VS Code

#### 3. **Tailwind CSS Issues**

```
Class names not working
```

**Solution**:
- Check `tailwind.config.ts`
- Ensure paths in content array are correct
- Restart development server

#### 4. **Next-Intl Error**

```
Locale not found
```

**Solution**:
- Check routing configuration
- Ensure corresponding message files exist

### 🔧 Debug Mode

```bash
# Run with debug mode
DEBUG=* npm run dev

# Or debug Next.js only
DEBUG=next:* npm run dev
```

### 📊 Performance Monitoring

Use Next.js built-in analytics:

```tsx
// next.config.js
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
}
```

## 🤝 Contributing

### 🔄 Contribution Process

1. **Fork** the repository
2. **Create branch**: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `npm run commit` (using Commitizen)
4. **Push** branch: `git push origin feature/amazing-feature`
5. **Create Pull Request**

### 📋 Coding Standards

- **ESLint**: Follow configured rules
- **Prettier**: Format code before commit
- **TypeScript**: Use strict typing
- **Commits**: Use conventional commits

### 🧪 Testing Requirements

- Unit tests for new components
- Integration tests for features
- Ensure coverage >= 80%

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: your-email@example.com
- **GitHub**: [@your-username](https://github.com/your-username)
- **Issues**: [GitHub Issues](https://github.com/your-username/nextjs-supabase-app/issues)

---

## 🙏 Acknowledgments

Thanks to these amazing libraries and tools:

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - The Open Source Firebase Alternative
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library

---

**Happy Coding! 🚀**

> If this README is helpful, please ⭐ star the repository to support the project!