# 🤝 Contributing Guide

> **🇺🇸 English** | **[🇻🇳 Tiếng Việt](CONTRIBUTING.md)** | **[📖 Main README](README_EN.md)** | **[📝 Changelog](CHANGELOG_EN.md)**

Thank you for your interest in contributing to **Store Management System**! This document will guide you through the most effective ways to contribute.

## 📋 Table of Contents

- [🔍 Before You Start](#-before-you-start)
- [🏗️ Development Environment Setup](#️-development-environment-setup)
- [🔄 Contribution Process](#-contribution-process)
- [📝 Coding Standards](#-coding-standards)
- [🧪 Testing Guidelines](#-testing-guidelines)
- [📋 Commit Guidelines](#-commit-guidelines)
- [🐛 Bug Reports](#-bug-reports)
- [💡 Feature Requests](#-feature-requests)
- [📖 Documentation Contributions](#-documentation-contributions)

## 🔍 Before You Start

### ✅ Check Existing Issues

Before creating a new issue or pull request:

1. **Search Issues**: Check if the problem has already been reported
2. **Check Pull Requests**: See if someone is already working on that feature
3. **Read Roadmap**: Review the project development plan

### 🎯 Welcome Contribution Types

- 🐛 **Bug fixes**: Fix bugs in the code
- ✨ **New features**: Add new functionality
- 📝 **Documentation**: Improve documentation
- 🎨 **UI/UX improvements**: Enhance user interface
- ⚡ **Performance**: Optimize performance
- 🧪 **Tests**: Add or improve tests
- 🌐 **Translations**: Add new languages

## 🏗️ Development Environment Setup

### 📋 System Requirements

- **Node.js**: >= 18.0.0
- **npm/yarn/pnpm**: Latest version
- **Git**: Latest version
- **VS Code**: Recommended (with extensions)

### 🔧 Installation

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/nextjs-supabase-app.git
cd nextjs-supabase-app

# 3. Add upstream remote
git remote add upstream https://github.com/original-owner/nextjs-supabase-app.git

# 4. Install dependencies
npm install

# 5. Copy environment file
cp .env.example .env.local

# 6. Configure Supabase (see README.md)

# 7. Run development server
npm run dev
```

### 🔌 VS Code Extensions

Install recommended extensions:

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

## 🔄 Contribution Process

### 1. 🌿 Create New Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create new branch with descriptive name
git checkout -b feature/user-authentication
# or
git checkout -b fix/login-validation-error
# or
git checkout -b docs/update-installation-guide
```

### 2. 💻 Develop Feature

- Write code following [Coding Standards](#-coding-standards)
- Add tests for new code
- Update documentation if needed
- Commit frequently with clear messages

### 3. ✅ Quality Checks

```bash
# Run all checks before submitting
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run format:check  # Prettier
npm run test          # Jest tests
npm run build         # Production build
```

### 4. 📤 Create Pull Request

```bash
# Push branch to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

#### 📋 Pull Request Template

When creating a PR, please include:

```markdown
## 📝 Description

Brief description of your changes.

## 🔗 Related Links

- Fixes #123
- Related to #456

## 🧪 Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Documentation updated

## 📸 Screenshots (if UI changes)

Add before/after screenshots for UI changes.

## ✅ Checklist

- [ ] Code follows coding standards
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] PR title clearly describes changes
```

## 📝 Coding Standards

### 🎨 Code Style

We use **ESLint** and **Prettier** to maintain consistent code style:

```bash
# Auto-format code
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

// 1. Interfaces/Types (export if needed externally)
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
- **E2E tests**: Test user workflows (coming soon)

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📋 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) with **Commitizen**.

### 🔧 Using Commitizen

```bash
# Instead of git commit, use:
npm run commit
```

### 📝 Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation updates
- **style**: Formatting changes (no logic impact)
- **refactor**: Code refactoring
- **test**: Add/update tests
- **chore**: Update build tasks, package manager

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

## 🐛 Bug Reports

### 📋 Bug Report Template

When reporting bugs, please include:

```markdown
## 🐛 Bug Description

Brief description of the bug.

## 🔄 Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ Expected Behavior

Describe what you expected to happen.

## ❌ Actual Behavior

Describe what actually happened.

## 📸 Screenshots

If applicable, add screenshots.

## 💻 Environment

- OS: [e.g. Windows 11, macOS 12]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js: [e.g. 18.17.0]
- Device: [e.g. Desktop, Mobile]

## 📝 Additional Information

Add any other information about the bug.
```

## 💡 Feature Requests

### 📋 Feature Request Template

```markdown
## 🚀 Feature Summary

Brief description of the feature you want.

## 🎯 Problem to Solve

Why is this feature needed? What problem will it solve?

## 💡 Proposed Solution

Detailed description of the solution you want.

## 🔄 Alternatives

Describe alternative solutions you've considered.

## 📝 Additional Information

Add any other context or screenshots.

## ✅ Acceptance Criteria

- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3
```

## 📖 Documentation Contributions

### 📝 Documentation Standards

- **Clear and concise**: Write for beginners
- **Real examples**: Include code examples
- **Regular updates**: Keep docs in sync with code
- **Markdown**: Use Markdown format

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

All contributors will be recognized in:

- **README.md**: Contributors section
- **CHANGELOG.md**: Release notes
- **GitHub**: Contributors graph

## 📞 Support

If you need help:

- 💬 **GitHub Discussions**: Ask general questions
- 🐛 **GitHub Issues**: Report bugs or feature requests
- 📧 **Email**: contact@yourproject.com

---

## 🙏 Thank You

Thank you for taking the time to contribute to the project! Every contribution, big or small, is valuable to us.

**Happy Coding! 🚀**