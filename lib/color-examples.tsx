// File demo để xem cách sử dụng hệ thống màu sắc tập trung
// Bạn có thể import và sử dụng trong các component khác

import { colors } from './colors';

// Ví dụ sử dụng trong component
export const ColorExamples = {
  // Sử dụng màu cho text
  primaryText: `text-blue-600`, // hoặc dùng colors.primary.text

  // Sử dụng màu cho background
  primaryBackground: `bg-blue-600 text-white`,

  // Sử dụng màu cho border
  primaryBorder: `border-blue-600`,

  // Sử dụng màu cho input focus
  inputFocus: `focus:ring-2 focus:ring-blue-500 focus:border-transparent`,

  // Sử dụng màu cho hover states
  hoverEffect: `hover:bg-blue-50 hover:border-blue-700`,
};

// Hướng dẫn sử dụng:
/*
1. Import colors từ '@/lib/colors'
2. Sử dụng trực tiếp: colors.primary.text
3. Hoặc sử dụng helper functions: getButtonColors('primary')

Ví dụ trong component:
```tsx
import { colors, getButtonColors } from '@/lib/colors';

// Cách 1: Sử dụng trực tiếp
<div className={colors.primary[600]}>Primary Button</div>

// Cách 2: Sử dụng helper function
<button className={getButtonColors('primary')}>Button</button>

// Cách 3: Kết hợp với className khác
<div className={`${colors.primary.text} font-bold`}>Text</div>
```

Để thay đổi màu sắc toàn bộ dự án:
1. Mở file lib/colors.ts
2. Thay đổi các giá trị màu (ví dụ: blue-600 thành green-600)
3. Tất cả component sẽ tự động cập nhật màu mới
*/