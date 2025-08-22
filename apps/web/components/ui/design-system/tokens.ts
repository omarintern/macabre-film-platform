/**
 * Design System Tokens
 * 
 * Inspired by Barnsworthburning.net minimalist aesthetic
 * WCAG 2.1 AA compliant color contrast ratios
 * Mobile-first responsive design system
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary Colors - Minimalist palette
  primary: {
    50: '#f8fafc',   // Lightest background
    100: '#f1f5f9',  // Light background
    200: '#e2e8f0',  // Border/subtle background
    300: '#cbd5e1',  // Disabled state
    400: '#94a3b8',  // Placeholder text
    500: '#64748b',  // Secondary text
    600: '#475569',  // Primary text
    700: '#334155',  // Strong text
    800: '#1e293b',  // Headings
    900: '#0f172a',  // Darkest text
  },
  
  // Accent Colors - Limited palette for emphasis
  accent: {
    blue: '#3b82f6',    // Primary action
    blueHover: '#2563eb',
    green: '#10b981',   // Success
    red: '#ef4444',     // Error
    yellow: '#f59e0b',  // Warning
  },
  
  // Semantic Colors
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  
  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text Colors
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    disabled: '#94a3b8',
    inverse: '#ffffff',
  },
  
  // Border Colors
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  
  // Font Sizes - Mobile-first scale
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// SPACING SYSTEM
// ============================================================================

export const spacing = {
  // Base spacing units (4px grid)
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// ============================================================================
// BREAKPOINTS (Mobile-first)
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

export const componentVariants = {
  // Button Variants
  button: {
    primary: {
      backgroundColor: colors.accent.blue,
      color: colors.text.inverse,
      border: 'none',
      '&:hover': {
        backgroundColor: colors.accent.blueHover,
      },
      '&:focus': {
        outline: `2px solid ${colors.accent.blue}`,
        outlineOffset: '2px',
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.text.primary,
      border: `1px solid ${colors.border.medium}`,
      '&:hover': {
        backgroundColor: colors.background.secondary,
      },
      '&:focus': {
        outline: `2px solid ${colors.accent.blue}`,
        outlineOffset: '2px',
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text.secondary,
      border: 'none',
      '&:hover': {
        backgroundColor: colors.background.secondary,
        color: colors.text.primary,
      },
      '&:focus': {
        outline: `2px solid ${colors.accent.blue}`,
        outlineOffset: '2px',
      },
    },
    danger: {
      backgroundColor: colors.semantic.error,
      color: colors.text.inverse,
      border: 'none',
      '&:hover': {
        backgroundColor: '#dc2626',
      },
      '&:focus': {
        outline: `2px solid ${colors.semantic.error}`,
        outlineOffset: '2px',
      },
    },
  },
  
  // Input Variants
  input: {
    default: {
      border: `1px solid ${colors.border.medium}`,
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
      '&:focus': {
        borderColor: colors.accent.blue,
        outline: 'none',
        boxShadow: `0 0 0 3px ${colors.accent.blue}20`,
      },
      '&:disabled': {
        backgroundColor: colors.background.secondary,
        color: colors.text.disabled,
        cursor: 'not-allowed',
      },
    },
    error: {
      border: `1px solid ${colors.semantic.error}`,
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
      '&:focus': {
        borderColor: colors.semantic.error,
        outline: 'none',
        boxShadow: `0 0 0 3px ${colors.semantic.error}20`,
      },
    },
  },
  
  // Card Variants
  card: {
    default: {
      backgroundColor: colors.background.primary,
      border: `1px solid ${colors.border.light}`,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
    },
    elevated: {
      backgroundColor: colors.background.primary,
      border: 'none',
      borderRadius: borderRadius.lg,
      boxShadow: shadows.lg,
    },
  },
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

export const animations = {
  // Transitions
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  // Keyframes
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    slideUp: {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
  },
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  componentVariants,
  animations,
  zIndex,
} as const;

export default designTokens;
