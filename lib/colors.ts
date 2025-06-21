// Tập trung tất cả màu sắc của dự án tại đây
// Để thay đổi màu sắc toàn bộ dự án, chỉ cần sửa file này

export const colors = {
  // Màu chính của hệ thống
  primary: {
    50: 'bg-blue-50 text-blue-900 border-blue-200',
    100: 'bg-blue-100 text-blue-900 border-blue-200',
    500: 'bg-blue-500 text-white',
    600: 'bg-blue-600 text-white hover:bg-blue-700',
    700: 'bg-blue-700 text-white',
    text: 'text-blue-600',
    border: 'border-blue-600',
    hover: 'hover:bg-blue-50 hover:border-blue-700',
  },

  // Màu phụ (xám)
  secondary: {
    50: 'bg-gray-50 text-gray-900',
    100: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-200',
    200: 'bg-gray-200 text-gray-900 border-gray-300',
    600: 'text-gray-600',
    700: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    900: 'text-gray-900',
    border: 'border-gray-300',
  },

  // Màu thành công (xanh lá)
  success: {
    50: 'bg-green-50 text-green-900 border-green-200',
    100: 'bg-green-100 text-green-900 border-green-200',
    600: 'text-green-600',
    hover: 'hover:bg-green-50',
  },

  // Màu cảnh báo (vàng)
  warning: {
    50: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    100: 'bg-yellow-100 text-yellow-900 border-yellow-200',
    600: 'text-yellow-600',
    hover: 'hover:bg-yellow-50',
  },

  // Màu nguy hiểm (đỏ)
  danger: {
    50: 'bg-red-50 text-red-900 border-red-200',
    100: 'bg-red-100 text-red-900 border-red-200',
    600: 'bg-red-600 text-white hover:bg-red-700',
    700: 'bg-red-700 text-white',
    text: 'text-red-600',
    hover: 'hover:bg-red-50',
  },

  // Màu nền và viền
  background: {
    white: 'bg-white',
    gray50: 'bg-gray-50',
    transparent: 'bg-transparent',
  },

  // Màu viền
  border: {
    default: 'border-gray-300',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    outline: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  },

  // Màu scrollbar
  scrollbar: {
    track: '#f1f5f9',
    thumb: '#cbd5e1',
    thumbHover: '#94a3b8',
  },

  // Màu focus
  focus: {
    outline: '#3b82f6',
    ring: 'focus:ring-2 focus:ring-blue-500',
  },
} as const;

// Helper functions để dễ sử dụng
export const getButtonColors = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger') => {
  switch (variant) {
    case 'primary':
      return colors.primary[600];
    case 'secondary':
      return colors.secondary[100];
    case 'outline':
      return `border-2 ${colors.primary.border} ${colors.primary.text} ${colors.background.white} ${colors.primary.hover}`;
    case 'ghost':
      return colors.secondary[700];
    case 'danger':
      return colors.danger[600];
    default:
      return colors.primary[600];
  }
};

export const getBadgeColors = (variant: 'default' | 'secondary' | 'success' | 'warning' | 'danger') => {
  switch (variant) {
    case 'default':
      return colors.primary[100];
    case 'secondary':
      return colors.secondary[200];
    case 'success':
      return colors.success[100];
    case 'warning':
      return colors.warning[100];
    case 'danger':
      return colors.danger[100];
    default:
      return colors.primary[100];
  }
};

export const getAlertColors = (variant: 'info' | 'success' | 'warning' | 'error') => {
  switch (variant) {
    case 'info':
      return {
        container: colors.primary[50],
        iconColor: colors.primary.text,
      };
    case 'success':
      return {
        container: colors.success[50],
        iconColor: colors.success[600],
      };
    case 'warning':
      return {
        container: colors.warning[50],
        iconColor: colors.warning[600],
      };
    case 'error':
      return {
        container: colors.danger[50],
        iconColor: colors.danger.text,
      };
    default:
      return {
        container: colors.primary[50],
        iconColor: colors.primary.text,
      };
  }
};