// Bảng màu ấm cho cửa hàng đồ uống
// Tập trung tất cả màu sắc của dự án tại đây

export const beverageColors = {
  // 🍫 Màu chủ đạo 1 - Nâu nhạt (Nền chính)
  primary: {
    main: '#e0c2aa', // Nâu nhạt
    light: '#f5e6d9', // Màu sáng hơn nền chính
    dark: '#c9a87f', // Màu đậm hơn nền chính
    text: 'text-[#e0c2aa]',
    bg: 'bg-[#e0c2aa]',
    bgLight: 'bg-[#f5e6d9]',
    bgDark: 'bg-[#c9a87f]',
    border: 'border-[#e0c2aa]',
    hover: 'hover:bg-[#c9a87f]',
    gradient: 'bg-gradient-to-r from-[#e0c2aa] to-[#c9a87f]',
  },

  // 🥛 Màu chủ đạo 2 - Cam đất (Màu nổi bật)
  secondary: {
    main: '#cf9145', // Cam đất
    light: '#e6b56a', // Cam nhạt hơn
    dark: '#a66f2a', // Cam đậm hơn
    text: 'text-[#cf9145]',
    bg: 'bg-[#cf9145]',
    bgLight: 'bg-[#e6b56a]',
    bgDark: 'bg-[#a66f2a]',
    border: 'border-[#cf9145]',
    hover: 'hover:bg-[#a66f2a]',
    gradient: 'bg-gradient-to-r from-[#cf9145] to-[#a66f2a]',
  },

  // 🍯 Màu phụ - Nâu đậm
  accent: {
    main: '#844c18', // Nâu đậm
    light: '#a26a2a', // Nâu nhạt hơn
    dark: '#5c360f', // Nâu đậm hơn
    text: 'text-[#844c18]',
    bg: 'bg-[#844c18]',
    bgLight: 'bg-[#a26a2a]',
    bgDark: 'bg-[#5c360f]',
    border: 'border-[#844c18]',
    hover: 'hover:bg-[#5c360f]',
    gradient: 'bg-gradient-to-r from-[#844c18] to-[#5c360f]',
  },

  // 🍵 Màu tươi nhẹ - Vàng caramel
  highlight: {
    main: '#C1A57B', // Vàng caramel
    light: '#F5DEB3', // Vàng nhạt
    dark: '#B8860B', // Vàng đậm
    text: 'text-[#C1A57B]',
    bg: 'bg-[#C1A57B]',
    bgLight: 'bg-[#F5DEB3]',
    bgDark: 'bg-[#B8860B]',
    border: 'border-[#C1A57B]',
    hover: 'hover:bg-[#B8860B]',
    gradient: 'bg-gradient-to-r from-[#C1A57B] to-[#B8860B]',
  },

  // ☕ Màu chữ chính - Nâu đen
  text: {
    primary: '#3E2C1C', // Nâu đen
    secondary: '#8B4513', // Nâu đậm
    muted: '#A0522D', // Nâu gỗ
    light: '#D2B48C', // Nâu nhạt
    white: '#FFF8F0', // Trắng kem
    textPrimary: 'text-[#3E2C1C]',
    textSecondary: 'text-[#8B4513]',
    textMuted: 'text-[#A0522D]',
    textLight: 'text-[#D2B48C]',
    textWhite: 'text-[#FFF8F0]',
  },

  // 🍂 Nền và background
  background: {
    main: '#FFF8F0', // Trắng kem
    secondary: '#F4E1D2', // Be sữa
    muted: '#EEE5DE', // Xám-be nhạt
    dark: '#3E2C1C', // Nâu đen
    bgMain: 'bg-[#FFF8F0]',
    bgSecondary: 'bg-[#F4E1D2]',
    bgMuted: 'bg-[#EEE5DE]',
    bgDark: 'bg-[#3E2C1C]',
  },

  // Gradients cho các thành phần
  gradients: {
    warm: 'bg-gradient-to-br from-[#FFF8F0] via-[#F4E1D2] to-[#EEE5DE]',
    primary: 'bg-gradient-to-r from-[#A0522D] to-[#8B4513]',
    accent: 'bg-gradient-to-r from-[#D2691E] to-[#A0522D]',
    highlight: 'bg-gradient-to-r from-[#C1A57B] to-[#B8860B]',
    soft: 'bg-gradient-to-br from-[#F4E1D2] to-[#EEE5DE]',
    card: 'bg-gradient-to-br from-[#FFF8F0]/80 to-[#F4E1D2]/60',
  },

  // Shadows và effects
  shadows: {
    sm: 'shadow-sm shadow-[#A0522D]/10',
    md: 'shadow-md shadow-[#A0522D]/15',
    lg: 'shadow-lg shadow-[#A0522D]/20',
    xl: 'shadow-xl shadow-[#A0522D]/25',
    '2xl': 'shadow-2xl shadow-[#A0522D]/30',
  },

  // States (success, warning, error)
  states: {
    success: {
      main: '#8FBC8F', // Xanh lá nhạt ấm
      bg: 'bg-[#8FBC8F]',
      text: 'text-[#8FBC8F]',
      border: 'border-[#8FBC8F]',
    },
    warning: {
      main: '#DAA520', // Vàng đậm ấm
      bg: 'bg-[#DAA520]',
      text: 'text-[#DAA520]',
      border: 'border-[#DAA520]',
    },
    error: {
      main: '#CD5C5C', // Đỏ ấm
      bg: 'bg-[#CD5C5C]',
      text: 'text-[#CD5C5C]',
      border: 'border-[#CD5C5C]',
    },
  },
} as const;

// Helper functions để dễ sử dụng
export const getCardStyles = (variant: 'primary' | 'secondary' | 'accent' | 'soft' = 'soft') => {
  const baseStyles = 'rounded-xl border backdrop-blur-sm transition-all duration-300';

  switch (variant) {
    case 'primary':
      return `${baseStyles} ${beverageColors.gradients.card} ${beverageColors.shadows.lg} hover:${beverageColors.shadows.xl} border-[#A0522D]/20`;
    case 'secondary':
      return `${baseStyles} ${beverageColors.background.bgSecondary} ${beverageColors.shadows.md} hover:${beverageColors.shadows.lg} border-[#D2691E]/20`;
    case 'accent':
      return `${baseStyles} ${beverageColors.gradients.soft} ${beverageColors.shadows.md} hover:${beverageColors.shadows.lg} border-[#C1A57B]/20`;
    case 'soft':
    default:
      return `${baseStyles} ${beverageColors.background.bgMain} ${beverageColors.shadows.sm} hover:${beverageColors.shadows.md} border-[#EEE5DE]/50`;
  }
};

export const getButtonStyles = (variant: 'primary' | 'secondary' | 'accent' | 'outline' = 'primary') => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center';

  switch (variant) {
    case 'primary':
      return `${baseStyles} ${beverageColors.primary.gradient} ${beverageColors.text.textWhite} ${beverageColors.shadows.md} hover:${beverageColors.shadows.lg}`;
    case 'secondary':
      return `${baseStyles} ${beverageColors.secondary.bg} ${beverageColors.text.textPrimary} ${beverageColors.shadows.sm} ${beverageColors.secondary.hover}`;
    case 'accent':
      return `${baseStyles} ${beverageColors.accent.gradient} ${beverageColors.text.textWhite} ${beverageColors.shadows.md} hover:${beverageColors.shadows.lg}`;
    case 'outline':
      return `${baseStyles} ${beverageColors.background.bgMain} ${beverageColors.text.textPrimary} ${beverageColors.primary.border} border-2 hover:${beverageColors.secondary.bgDark}`;
    default:
      return `${baseStyles} ${beverageColors.primary.gradient} ${beverageColors.text.textWhite} ${beverageColors.shadows.md}`;
  }
};

export const getBadgeStyles = (variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' = 'primary') => {
  const baseStyles = 'px-3 py-1 rounded-full text-sm font-medium';

  switch (variant) {
    case 'primary':
      return `${baseStyles} ${beverageColors.primary.gradient} ${beverageColors.text.textWhite}`;
    case 'secondary':
      return `${baseStyles} ${beverageColors.secondary.bg} ${beverageColors.text.textPrimary}`;
    case 'accent':
      return `${baseStyles} ${beverageColors.accent.gradient} ${beverageColors.text.textWhite}`;
    case 'success':
      return `${baseStyles} ${beverageColors.states.success.bg} ${beverageColors.text.textWhite}`;
    case 'warning':
      return `${baseStyles} ${beverageColors.states.warning.bg} ${beverageColors.text.textWhite}`;
    case 'error':
      return `${baseStyles} ${beverageColors.states.error.bg} ${beverageColors.text.textWhite}`;
    default:
      return `${baseStyles} ${beverageColors.primary.gradient} ${beverageColors.text.textWhite}`;
  }
};

// Legacy colors for backward compatibility
export const colors = {
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
  secondary: {
    50: 'bg-gray-50 text-gray-900',
    100: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-200',
    200: 'bg-gray-200 text-gray-900 border-gray-300',
    600: 'text-gray-600',
    700: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    900: 'text-gray-900',
    border: 'border-gray-300',
  },
  success: {
    50: 'bg-green-50 text-green-900 border-green-200',
    100: 'bg-green-100 text-green-900 border-green-200',
    600: 'text-green-600',
    hover: 'hover:bg-green-50',
  },
  warning: {
    50: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    100: 'bg-yellow-100 text-yellow-900 border-yellow-200',
    600: 'text-yellow-600',
    hover: 'hover:bg-yellow-50',
  },
  danger: {
    50: 'bg-red-50 text-red-900 border-red-200',
    100: 'bg-red-100 text-red-900 border-red-200',
    600: 'bg-red-600 text-white hover:bg-red-700',
    700: 'bg-red-700 text-white',
    text: 'text-red-600',
    hover: 'hover:bg-red-50',
  },
  background: {
    white: 'bg-white',
    gray50: 'bg-gray-50',
    transparent: 'bg-transparent',
  },
  border: {
    default: 'border-gray-300',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    outline: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  },
  scrollbar: {
    track: '#f1f5f9',
    thumb: '#cbd5e1',
    thumbHover: '#94a3b8',
  },
  focus: {
    outline: '#3b82f6',
    ring: 'focus:ring-2 focus:ring-blue-500',
  },
} as const;

// Helper functions for legacy compatibility
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