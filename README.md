# 🏪 Store Management System

> **[🇺🇸 English Version](README_EN.md)** | **🇻🇳 Tiếng Việt** | **[🤝 Contributing](CONTRIBUTING.md)** | **[📝 Changelog](CHANGELOG.md)**

Hệ thống quản lý cửa hàng hiện đại được xây dựng với **Next.js 15** và **Supabase**, hỗ trợ đa ngôn ngữ (Tiếng Việt/English) với giao diện người dùng thân thiện và hiệu suất cao.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.50.0-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 📋 Mục lục

- [✨ Tính năng chính](#-tính-năng-chính)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [📁 Cấu trúc dự án](#-cấu-trúc-dự-án)
- [🚀 Cài đặt và chạy](#-cài-đặt-và-chạy)
- [⚙️ Cấu hình môi trường](#️-cấu-hình-môi-trường)
- [📚 Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [🛠️ Phát triển](#️-phát-triển)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [❓ Troubleshooting](#-troubleshooting)
- [🤝 Đóng góp](#-đóng-góp)

## ✨ Tính năng chính

### 🎯 Quản lý toàn diện
- **📦 Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm với variants (màu sắc, kích thước, v.v.)
- **🛒 Quản lý đơn hàng**: Theo dõi trạng thái đơn hàng, lịch sử mua hàng
- **👥 Quản lý khách hàng**: Thông tin khách hàng, liên hệ, lịch sử giao dịch
- **🏬 Quản lý cửa hàng**: Thông tin cửa hàng, chi nhánh
- **📂 Quản lý danh mục**: Phân loại sản phẩm theo danh mục

### 🌐 Đa ngôn ngữ
- **🇻🇳 Tiếng Việt**: Giao diện hoàn toàn tiếng Việt
- **🇺🇸 English**: Hỗ trợ tiếng Anh
- **🔄 Chuyển đổi linh hoạt**: Chuyển ngôn ngữ trong thời gian thực

### 🎨 Giao diện hiện đại
- **📱 Responsive Design**: Tối ưu cho mọi thiết bị
- **🌙 Dark/Light Mode**: Giao diện sáng/tối (sẵn sàng)
- **⚡ Performance**: Tải nhanh với Next.js 15 và Turbopack
- **🎭 Animation**: Hiệu ứng mượt mà với Framer Motion

## 🛠️ Công nghệ sử dụng

### 🏗️ Core Framework
- **[Next.js 15](https://nextjs.org/)**: React framework với App Router
- **[React 19](https://react.dev/)**: Thư viện UI hiện đại nhất
- **[TypeScript](https://www.typescriptlang.org/)**: Type safety và developer experience

### 🗄️ Database & Backend
- **[Supabase](https://supabase.com/)**: Database PostgreSQL, Authentication, Real-time
- **[Supabase JS](https://supabase.com/docs/reference/javascript)**: Client SDK cho JavaScript

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
- **[Next-Intl](https://next-intl-docs.vercel.app/)**: i18n cho Next.js

### 🧪 Testing & Quality
- **[Jest](https://jestjs.io/)**: Testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)**: Component testing
- **[ESLint](https://eslint.org/)**: Code linting
- **[Prettier](https://prettier.io/)**: Code formatting
- **[Husky](https://typicode.github.io/husky/)**: Git hooks

## 📁 Cấu trúc dự án

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

## 🚀 Cài đặt và chạy

### 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 hoặc **yarn**: >= 1.22.0
- **Git**: Latest version

### 🔽 Bước 1: Clone repository

```bash
# Clone dự án từ GitHub
git clone https://github.com/your-username/nextjs-supabase-app.git

# Di chuyển vào thư mục dự án
cd nextjs-supabase-app
```

### 📦 Bước 2: Cài đặt dependencies

```bash
# Sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install

# Hoặc sử dụng pnpm (khuyến nghị)
pnpm install
```

### ⚙️ Bước 3: Cấu hình môi trường

Tạo file `.env.local` từ file mẫu:

```bash
# Copy file env example
cp .env.example .env.local
```

Chỉnh sửa file `.env.local`:

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

### 🗄️ Bước 4: Cấu hình Database

#### 4.1 Tạo project Supabase

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Tạo project mới
3. Lấy `Project URL` và `anon key` từ Settings > API

#### 4.2 Chạy migrations

```bash
# Chạy các file migration trong thư mục migrations/
# Bạn có thể chạy trực tiếp trong Supabase SQL Editor
```

### 🏃‍♂️ Bước 5: Chạy ứng dụng

```bash
# Development mode với Turbopack
npm run dev

# Hoặc
yarn dev

# Hoặc
pnpm dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

## ⚙️ Cấu hình môi trường

### 🔑 Biến môi trường cần thiết

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL của Supabase project | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key của Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_APP_URL` | URL của ứng dụng | `http://localhost:3000` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Ngôn ngữ mặc định | `vi` hoặc `en` |

### 🛠️ Cấu hình Supabase

1. **Authentication**: Bật email authentication
2. **Database**: Tạo các table theo schema
3. **Storage**: Cấu hình bucket cho upload files (nếu cần)
4. **RLS Policies**: Cấu hình Row Level Security

## 📚 Hướng dẫn sử dụng

### 🏠 Dashboard

Sau khi chạy ứng dụng, truy cập `/dashboard` để xem tổng quan hệ thống:

- **📊 Thống kê**: Tổng số sản phẩm, đơn hàng, khách hàng
- **🔄 Hoạt động gần đây**: Theo dõi các thay đổi mới nhất
- **📈 Biểu đồ**: Phân tích dữ liệu (sắp có)

### 📦 Quản lý sản phẩm

- **Thêm sản phẩm**: Tên, mô tả, giá, hình ảnh
- **Variants**: Thêm biến thể màu sắc, kích thước
- **Danh mục**: Phân loại sản phẩm
- **Tình trạng**: Quản lý tồn kho

### 🛒 Quản lý đơn hàng

- **Tạo đơn hàng**: Chọn sản phẩm, khách hàng
- **Trạng thái**: Đang xử lý, Đã giao, Đã hủy
- **Thanh toán**: Theo dõi trạng thái thanh toán

### 👥 Quản lý khách hàng

- **Thông tin cá nhân**: Tên, email, số điện thoại
- **Địa chỉ**: Địa chỉ giao hàng
- **Lịch sử**: Đơn hàng đã mua

## 🛠️ Phát triển

### 📝 Scripts có sẵn

```bash
# Development
npm run dev              # Chạy development server với Turbopack
npm run build           # Build production
npm run start           # Chạy production server

# Code Quality
npm run lint            # Chạy ESLint
npm run lint:fix        # Tự động sửa lỗi ESLint
npm run format          # Format code với Prettier
npm run format:check    # Kiểm tra format
npm run type-check      # Kiểm tra TypeScript

# Testing
npm run test            # Chạy tests
npm run test:watch      # Chạy tests ở watch mode
npm run test:coverage   # Chạy tests với coverage

# Git & Commits
npm run prepare         # Setup Husky hooks
npm run commit          # Commit với Commitizen
```

### 🔧 Cấu hình IDE

#### Visual Studio Code

Cài đặt extensions khuyến nghị:

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

### 🏗️ Cấu trúc component

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

Sử dụng color system được định nghĩa trong `lib/colors.ts`:

```tsx
import { beverageColors } from '@/lib/colors';

// Sử dụng trong component
<div className={beverageColors.primary.bg}>
  Content
</div>
```

## 🧪 Testing

### 🧪 Unit Tests

```bash
# Chạy tất cả tests
npm run test

# Chạy tests với watch mode
npm run test:watch

# Chạy tests với coverage
npm run test:coverage
```

### 📝 Viết tests

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

### 🔍 E2E Tests (Sắp có)

```bash
# Sẽ thêm Playwright hoặc Cypress
npm run test:e2e
```

## 🚀 Deployment

### 🌍 Vercel (Khuyến nghị)

1. **Push code lên GitHub**
2. **Kết nối với Vercel**:
   - Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
   - Import repository
   - Cấu hình environment variables
3. **Deploy**: Vercel sẽ tự động deploy

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
# Build và chạy Docker
docker build -t store-management .
docker run -p 3000:3000 store-management
```

### ⚙️ Environment Variables cho Production

```env
# Production Environment
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=your_production_database_url
```

## ❓ Troubleshooting

### 🐛 Các lỗi thường gặp

#### 1. **Lỗi Supabase connection**

```
Error: Invalid Supabase URL or Key
```

**Giải pháp**:
- Kiểm tra `.env.local`
- Đảm bảo URL và key chính xác
- Restart development server

#### 2. **Lỗi TypeScript**

```
Type error: Cannot find module '@/lib/utils'
```

**Giải pháp**:
- Kiểm tra `tsconfig.json` paths
- Restart TypeScript server trong VS Code

#### 3. **Lỗi Tailwind CSS**

```
Class names not working
```

**Giải pháp**:
- Kiểm tra `tailwind.config.ts`
- Đảm bảo paths trong content array chính xác
- Restart development server

#### 4. **Lỗi Next-Intl**

```
Locale not found
```

**Giải pháp**:
- Kiểm tra routing configuration
- Đảm bảo có file message tương ứng

### 🔧 Debug mode

```bash
# Chạy với debug mode
DEBUG=* npm run dev

# Hoặc chỉ debug Next.js
DEBUG=next:* npm run dev
```

### 📊 Performance monitoring

Sử dụng Next.js built-in analytics:

```tsx
// next.config.js
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
}
```

## 🤝 Đóng góp

### 🔄 Quy trình đóng góp

1. **Fork** repository
2. **Tạo branch** mới: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `npm run commit` (sử dụng Commitizen)
4. **Push** branch: `git push origin feature/amazing-feature`
5. **Tạo Pull Request**

### 📋 Coding Standards

- **ESLint**: Tuân thủ rules được cấu hình
- **Prettier**: Format code trước khi commit
- **TypeScript**: Sử dụng strict typing
- **Commits**: Sử dụng conventional commits

### 🧪 Testing Requirements

- Unit tests cho components mới
- Integration tests cho features
- Đảm bảo coverage >= 80%

## 📄 License

Dự án này được cấp phép dưới [MIT License](LICENSE).

## 📞 Liên hệ

- **Email**: your-email@example.com
- **GitHub**: [@your-username](https://github.com/your-username)
- **Issues**: [GitHub Issues](https://github.com/your-username/nextjs-supabase-app/issues)

---

## 🙏 Cảm ơn

Cảm ơn các thư viện và công cụ tuyệt vời:

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - The Open Source Firebase Alternative
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library

---

**Happy Coding! 🚀**

> Nếu README này hữu ích, hãy ⭐ star repository để ủng hộ dự án!
