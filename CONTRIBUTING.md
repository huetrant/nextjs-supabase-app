# 🤝 Hướng dẫn đóng góp (Contributing Guide)

Cảm ơn bạn quan tâm đến việc đóng góp cho **Store Management System**! Tài liệu này sẽ hướng dẫn bạn cách đóng góp hiệu quả nhất.

## 📋 Mục lục

- [🔍 Trước khi bắt đầu](#-trước-khi-bắt-đầu)
- [🏗️ Thiết lập môi trường phát triển](#️-thiết-lập-môi-trường-phát-triển)
- [🔄 Quy trình đóng góp](#-quy-trình-đóng-góp)
- [📝 Coding Standards](#-coding-standards)
- [🧪 Testing Guidelines](#-testing-guidelines)
- [📋 Commit Guidelines](#-commit-guidelines)
- [🐛 Báo cáo Bug](#-báo-cáo-bug)
- [💡 Đề xuất tính năng](#-đề-xuất-tính-năng)
- [📖 Đóng góp Documentation](#-đóng-góp-documentation)

## 🔍 Trước khi bắt đầu

### ✅ Kiểm tra vấn đề hiện tại

Trước khi tạo issue hoặc pull request mới:

1. **Tìm kiếm trong Issues**: Kiểm tra xem vấn đề đã được báo cáo chưa
2. **Kiểm tra Pull Requests**: Xem có ai đang làm việc trên tính năng đó không
3. **Đọc Roadmap**: Tham khảo kế hoạch phát triển dự án

### 🎯 Các loại đóng góp được hoan nghênh

- 🐛 **Bug fixes**: Sửa lỗi trong code
- ✨ **New features**: Thêm tính năng mới
- 📝 **Documentation**: Cải thiện tài liệu
- 🎨 **UI/UX improvements**: Cải thiện giao diện
- ⚡ **Performance**: Tối ưu hiệu suất
- 🧪 **Tests**: Thêm hoặc cải thiện tests
- 🌐 **Translations**: Thêm ngôn ngữ mới

## 🏗️ Thiết lập môi trường phát triển

### 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm/yarn/pnpm**: Latest version
- **Git**: Latest version
- **VS Code**: Khuyến nghị (với extensions)

### 🔧 Cài đặt

```bash
# 1. Fork repository trên GitHub

# 2. Clone fork của bạn
git clone https://github.com/YOUR-USERNAME/nextjs-supabase-app.git
cd nextjs-supabase-app

# 3. Add upstream remote
git remote add upstream https://github.com/original-owner/nextjs-supabase-app.git

# 4. Cài đặt dependencies
npm install

# 5. Copy environment file
cp .env.example .env.local

# 6. Cấu hình Supabase (xem README.md)

# 7. Chạy development server
npm run dev
```

### 🔌 VS Code Extensions

Cài đặt các extensions được khuyến nghị:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## 🔄 Quy trình đóng góp

### 1. 🌿 Tạo branch mới

```bash
# Cập nhật main branch
git checkout main
git pull upstream main

# Tạo branch mới với tên mô tả
git checkout -b feature/user-authentication
# hoặc
git checkout -b fix/login-validation-error
# hoặc
git checkout -b docs/update-installation-guide
```

### 2. 💻 Phát triển tính năng

- Viết code theo [Coding Standards](#-coding-standards)
- Thêm tests cho code mới
- Cập nhật documentation nếu cần
- Commit thường xuyên với message rõ ràng

### 3. ✅ Kiểm tra chất lượng

```bash
# Chạy tất cả checks trước khi submit
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run format:check  # Prettier
npm run test          # Jest tests
npm run build         # Build production
```

### 4. 📤 Tạo Pull Request

```bash
# Push branch lên fork của bạn
git push origin feature/your-feature-name

# Tạo Pull Request trên GitHub
```

#### 📋 Pull Request Template

Khi tạo PR, hãy bao gồm:

```markdown
## 📝 Mô tả

Mô tả ngắn gọn về thay đổi của bạn.

## 🔗 Liên kết

- Fixes #123
- Related to #456

## 🧪 Kiểm tra

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Documentation updated

## 📸 Screenshots (nếu có thay đổi UI)

Thêm screenshots trước và sau nếu có thay đổi giao diện.

## ✅ Checklist

- [ ] Code tuân thủ coding standards
- [ ] Tests được thêm/cập nhật
- [ ] Documentation được cập nhật
- [ ] Commit messages tuân thủ quy tắc
- [ ] PR title mô tả rõ ràng
```

## 📝 Coding Standards

### 🎨 Code Style

Chúng tôi sử dụng **ESLint** và **Prettier** để duy trì code style nhất quán:

```bash
# Tự động format code
npm run format

# Fix ESLint issues
npm run lint:fix
```

### 🏗️ Component Structure

```tsx
// components/ui/Example.tsx
'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// 1. Interfaces/Types (export nếu cần dùng bên ngoài)
interface ExampleProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// 2. Component
export function Example({
  variant = 'primary',
  size = 'md',
  children,
  className,
  onClick,
}: ExampleProps) {
  // 3. State
  const [isLoading, setIsLoading] = useState(false);

  // 4. Handlers
  const handleClick = () => {
    setIsLoading(true);
    onClick?.();
    setIsLoading(false);
  };

  // 5. Render
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        // Variant styles
        variant === 'primary' && 'bg-primary text-primary-foreground',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground',
        // Size styles
        size === 'sm' && 'h-8 px-3 text-sm',
        size === 'md' && 'h-10 px-4',
        size === 'lg' && 'h-12 px-6 text-lg',
        // Custom className
        className
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      {children}
    </button>
  );
}

// 6. Display name (for debugging)
Example.displayName = 'Example';
```

### 📁 File Organization

```
components/
├── ui/                 # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── index.ts       # Export all components
├── layout/            # Layout components
└── features/          # Feature-specific components
```

### 🎯 TypeScript Guidelines

```tsx
// ✅ Good - Explicit types
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ✅ Good - Generic types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ❌ Avoid - any type
const userData: any = getUser();

// ✅ Good - Proper typing
const userData: User = getUser();
```

### 🎨 Tailwind CSS Guidelines

```tsx
// ✅ Good - Use cn() utility
className={cn(
  'base-classes',
  condition && 'conditional-classes',
  className
)}

// ✅ Good - Semantic class grouping
className="
  // Layout
  flex items-center justify-between
  // Spacing
  px-4 py-2 mx-2
  // Typography
  text-sm font-medium
  // Colors
  bg-primary text-primary-foreground
  // States
  hover:bg-primary/90 disabled:opacity-50
"

// ❌ Avoid - Hardcoded values (use Tailwind tokens)
className="text-[#ff0000]"  // Use text-red-500

// ✅ Good - Use Tailwind tokens
className="text-red-500"
```

## 🧪 Testing Guidelines

### 🔬 Unit Tests

```tsx
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');
  });
});
```

### 🧪 Test Requirements

- **Coverage**: Aim for >= 80% coverage
- **Unit tests**: Test individual components/functions
- **Integration tests**: Test component interactions
- **E2E tests**: Test user workflows (sắp có)

```bash
# Chạy tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📋 Commit Guidelines

Chúng tôi sử dụng [Conventional Commits](https://www.conventionalcommits.org/) với **Commitizen**.

### 🔧 Sử dụng Commitizen

```bash
# Thay vì git commit, sử dụng:
npm run commit
```

### 📝 Commit Types

- **feat**: Tính năng mới
- **fix**: Sửa bug
- **docs**: Cập nhật documentation
- **style**: Thay đổi format (không ảnh hưởng logic)
- **refactor**: Refactor code
- **test**: Thêm/cập nhật tests
- **chore**: Cập nhật build tasks, package manager

### ✅ Commit Examples

```bash
# Good commits
feat(auth): add user login functionality
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
style(components): format code with prettier
refactor(api): simplify user data fetching
test(auth): add login component tests
chore(deps): update dependencies

# Bad commits
fix: stuff
update
working on login
asdf
```

## 🐛 Báo cáo Bug

### 📋 Bug Report Template

Khi báo cáo bug, hãy bao gồm:

```markdown
## 🐛 Mô tả Bug

Mô tả ngắn gọn về bug.

## 🔄 Các bước tái tạo

1. Đi tới '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ Kết quả mong đợi

Mô tả kết quả bạn mong đợi.

## ❌ Kết quả thực tế

Mô tả kết quả thực tế xảy ra.

## 📸 Screenshots

Nếu có thể, thêm screenshots.

## 💻 Môi trường

- OS: [e.g. Windows 11, macOS 12]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js: [e.g. 18.17.0]
- Device: [e.g. Desktop, Mobile]

## 📝 Thông tin bổ sung

Thêm bất kỳ thông tin nào khác về bug.
```

## 💡 Đề xuất tính năng

### 📋 Feature Request Template

```markdown
## 🚀 Tóm tắt tính năng

Mô tả ngắn gọn về tính năng bạn muốn.

## 🎯 Vấn đề cần giải quyết

Tại sao tính năng này cần thiết? Vấn đề gì nó sẽ giải quyết?

## 💡 Giải pháp đề xuất

Mô tả chi tiết về giải pháp bạn muốn.

## 🔄 Alternatives

Mô tả các giải pháp thay thế bạn đã xem xét.

## 📝 Thông tin bổ sung

Thêm bất kỳ context hoặc screenshots nào khác.

## ✅ Acceptance Criteria

- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3
```

## 📖 Đóng góp Documentation

### 📝 Documentation Standards

- **Rõ ràng và súc tích**: Viết dễ hiểu cho người mới
- **Ví dụ thực tế**: Bao gồm code examples
- **Cập nhật thường xuyên**: Đảm bảo docs luôn đúng với code
- **Markdown**: Sử dụng Markdown format

### 📁 Documentation Structure

```
docs/
├── README.md              # Main documentation
├── CONTRIBUTING.md        # This file
├── INSTALLATION.md        # Detailed installation
├── API.md                # API documentation
├── DEPLOYMENT.md         # Deployment guide
└── TROUBLESHOOTING.md    # Common issues
```

## 🏆 Recognition

Tất cả contributors sẽ được ghi nhận trong:

- **README.md**: Contributors section
- **CHANGELOG.md**: Release notes
- **GitHub**: Contributors graph

## 📞 Hỗ trợ

Nếu bạn cần hỗ trợ:

- 💬 **GitHub Discussions**: Đặt câu hỏi chung
- 🐛 **GitHub Issues**: Báo cáo bug hoặc feature request
- 📧 **Email**: contact@yourproject.com

---

## 🙏 Cảm ơn

Cảm ơn bạn đã dành thời gian đóng góp cho dự án! Mỗi đóng góp, dù lớn hay nhỏ, đều rất có ý nghĩa với chúng tôi.

**Happy Coding! 🚀**