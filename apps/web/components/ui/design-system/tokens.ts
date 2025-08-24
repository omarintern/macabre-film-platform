/**
 * Design System Tokens
 * 
 * Synopsis Hub-inspired aesthetic with minimal pastels and clean typography
 * Content-forward design with elegant sidebar navigation and card-based layout
 * WCAG 2.1 AA compliant color contrast ratios
 * Mobile-first responsive design system
 */

// ============================================================================
// COLOR PALETTE - Synopsis Hub Minimalist
// ============================================================================

export const colors = {
  // Primary Colors - Minimal usage
  primary: {
    50: '#ffffff',   // Pure white background
    100: '#fafafa',  // Subtle off-white
    200: '#f5f5f5',  // Very light gray
    300: '#e5e5e5',  // Light borders
    400: '#d4d4d4',  // Medium borders
    500: '#a3a3a3',  // Placeholder text
    600: '#737373',  // Secondary text
    700: '#525252',  // Body text
    800: '#404040',  // Strong text
    900: '#1a1a1a',  // Primary text
  },
  
  // Content Card Colors - Subtle Pastels
  card: {
    orange: '#fff5f0',  // Action/Mystery content
    red: '#fef2f2',     // Horror/Thriller content
    green: '#f0fdf4',   // Drama/Character content
    pink: '#fdf2f8',    // Romance content
    blue: '#f0f9ff',    // Sci-fi/Fantasy content
    default: '#ffffff', // Default white cards
  },
  
  // Accent Colors - Minimal, purposeful
  accent: {
    primary: '#1a1a1a',    // Dark gray for primary actions
    secondary: '#404040',  // Medium gray for secondary actions
    subtle: '#6b7280',     // Light gray for subtle actions
  },
  
  // Semantic Colors
  semantic: {
    success: '#059669',
    error: '#dc2626',
    warning: '#d97706',
    info: '#2563eb',
  },
  
  // Background Colors - Clean hierarchy
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
    overlay: 'rgba(0, 0, 0, 0.4)',
    subtle: 'rgba(0, 0, 0, 0.02)',
  },
  
  // Text Colors - Typography-focused
  text: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#737373',
    disabled: '#a3a3a3',
    inverse: '#ffffff',
    muted: '#a3a3a3',
  },
  
  // Border Colors - Subtle and refined
  border: {
    light: '#f5f5f5',
    medium: '#e5e5e5',
    dark: '#d4d4d4',
    subtle: 'rgba(0, 0, 0, 0.06)',
  },
} as const;

// ============================================================================
// TYPOGRAPHY - Synopsis Hub Clean Hierarchy
// ============================================================================

export const typography = {
  // Font Families - Georgia for titles, Inter for body
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
    serif: ['Georgia', 'Times New Roman', 'serif'],
  },
  
  // Font Sizes - Refined scale for content hierarchy
  fontSize: {
    xs: '0.75rem',     // 12px - Captions, metadata
    sm: '0.875rem',    // 14px - Small text, labels
    base: '1rem',      // 16px - Body text
    lg: '1.125rem',    // 18px - Large body
    xl: '1.25rem',     // 20px - Subheadings
    '2xl': '1.5rem',   // 24px - Section headings
    '3xl': '1.875rem', // 30px - Page titles
    '4xl': '2.25rem',  // 36px - Hero titles
    '5xl': '3rem',     // 48px - Large hero
    '6xl': '3.75rem',  // 60px - Display text
  },
  
  // Font Weights - Refined weight system
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights - Optimized for readability
  lineHeight: {
    tight: '1.2',      // Headings
    snug: '1.375',     // Subheadings
    normal: '1.6',     // Body text
    relaxed: '1.75',   // Large body
    loose: '2',        // Poetry, quotes
  },
  
  // Letter Spacing - Refined spacing
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
// SPACING SYSTEM - Elegant and Consistent
// ============================================================================

export const spacing = {
  // Base spacing units (8px grid for elegance)
  0: '0',
  1: '0.25rem',   // 4px - Minimal spacing
  2: '0.5rem',    // 8px - Base unit
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
// BORDER RADIUS - Subtle and Refined
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px - Subtle
  base: '0.25rem',  // 4px - Default
  md: '0.375rem',   // 6px - Medium
  lg: '0.5rem',     // 8px - Large
  xl: '0.75rem',    // 12px - Extra large
  '2xl': '1rem',    // 16px - Cards
  '3xl': '1.5rem',  // 24px - Large cards
  full: '9999px',
} as const;

// ============================================================================
// SHADOWS - Subtle and Elegant
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
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
// COMPONENT VARIANTS - Refined and Purposeful
// ============================================================================

export const componentVariants = {
  // Button Variants - Minimal Synopsis Hub Style
  button: {
    primary: {
      backgroundColor: colors.primary[50], // White background
      color: colors.primary[900], // Dark text
      border: `1px solid ${colors.border.medium}`,
      fontWeight: typography.fontWeight.medium,
      '&:hover': {
        backgroundColor: colors.primary[100],
        borderColor: colors.border.dark,
      },
      '&:focus': {
        outline: `2px solid ${colors.accent.primary}`,
        outlineOffset: '2px',
      },
      '&:active': {
        backgroundColor: colors.primary[200],
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.text.secondary,
      border: `1px solid ${colors.border.light}`,
      fontWeight: typography.fontWeight.normal,
      '&:hover': {
        backgroundColor: colors.background.subtle,
        color: colors.text.primary,
      },
      '&:focus': {
        outline: `2px solid ${colors.accent.primary}`,
        outlineOffset: '2px',
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text.secondary,
      border: 'none',
      fontWeight: typography.fontWeight.normal,
      '&:hover': {
        backgroundColor: colors.background.subtle,
        color: colors.text.primary,
      },
      '&:focus': {
        outline: `2px solid ${colors.semantic.info}`,
        outlineOffset: '2px',
      },
    },
    danger: {
      backgroundColor: colors.semantic.error,
      color: colors.text.inverse,
      border: 'none',
      fontWeight: typography.fontWeight.medium,
      '&:hover': {
        backgroundColor: '#b91c1c',
        transform: 'translateY(-1px)',
        boxShadow: shadows.md,
      },
      '&:focus': {
        outline: `2px solid ${colors.semantic.error}`,
        outlineOffset: '2px',
      },
    },
  },
  
  // Input Variants - Clean and accessible
  input: {
    default: {
      border: `1px solid ${colors.border.medium}`,
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
      borderRadius: borderRadius.base,
      '&:focus': {
        borderColor: colors.semantic.info,
        outline: 'none',
        boxShadow: `0 0 0 3px rgba(37, 99, 235, 0.1)`,
      },
      '&:disabled': {
        backgroundColor: colors.background.secondary,
        color: colors.text.disabled,
        cursor: 'not-allowed',
      },
      '&::placeholder': {
        color: colors.text.muted,
      },
    },
    error: {
      border: `1px solid ${colors.semantic.error}`,
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
      borderRadius: borderRadius.base,
      '&:focus': {
        borderColor: colors.semantic.error,
        outline: 'none',
        boxShadow: `0 0 0 3px rgba(220, 38, 38, 0.1)`,
      },
    },
  },
  
  // Card Variants - Synopsis Hub Pastel Content Cards
  card: {
    default: {
      backgroundColor: colors.card.default,
      border: `1px solid ${colors.border.medium}`,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
    },
    orange: {
      backgroundColor: colors.card.orange,
      border: `1px solid ${colors.border.medium}`,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
    },
    red: {
      backgroundColor: colors.card.red,
      border: `1px solid ${colors.border.medium}`,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
    },
    green: {
      backgroundColor: colors.card.green,
      border: `1px solid ${colors.border.medium}`,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
    },
    pink: {
      backgroundColor: colors.card.pink,
      border: `1px solid ${colors.border.medium}`,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
    },
    blue: {
      backgroundColor: colors.card.blue,
      border: `1px solid ${colors.border.medium}`,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.sm,
    },
  },
} as const;

// ============================================================================
// ANIMATIONS - Smooth and Purposeful
// ============================================================================

export const animations = {
  // Transitions - Refined timing
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Keyframes - Elegant animations
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    slideUp: {
      '0%': { transform: 'translateY(20px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.98)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
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
