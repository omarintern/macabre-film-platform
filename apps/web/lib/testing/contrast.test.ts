/**
 * WCAG 2.1 AA Contrast Ratio Verification Tests
 * 
 * This test file verifies that our color definitions meet WCAG 2.1 AA standards:
 * - Normal text: 4.5:1 contrast ratio minimum
 * - Large text (18pt+): 3:1 contrast ratio minimum
 * - Non-text elements: 3:1 contrast ratio minimum
 */

// Color contrast calculation utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('WCAG 2.1 AA Contrast Ratio Verification', () => {
  // Light mode color definitions from globals.css
  const lightModeColors = {
    background: '#ffffff',
    foreground: '#1a1a1a',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
  };

  // Dark mode color definitions from globals.css
  const darkModeColors = {
    background: '#0a0a0a',
    foreground: '#ededed',
    gray100: '#1f2937',
    gray200: '#374151',
    gray300: '#4b5563',
    gray400: '#6b7280',
    gray500: '#9ca3af',
    gray600: '#d1d5db',
    gray700: '#e5e7eb',
    gray800: '#f3f4f6',
    gray900: '#f9fafb',
  };

  describe('Light Mode Contrast Ratios', () => {
    it('text-gray-600 on white background meets WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(lightModeColors.gray600, lightModeColors.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(7.56, 0); // Actual measured ratio - EXCELLENT!
    });

    it('text-gray-700 on white background meets WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(lightModeColors.gray700, lightModeColors.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(10.31, 0); // Actual measured ratio - EXCELLENT!
    });

    it('text-gray-900 on white background meets WCAG AAA (7:1)', () => {
      const ratio = getContrastRatio(lightModeColors.gray900, lightModeColors.background);
      expect(ratio).toBeGreaterThanOrEqual(7.0);
      expect(ratio).toBeCloseTo(17.74, 0); // Actual measured ratio - OUTSTANDING!
    });

    it('foreground text on background meets WCAG AA', () => {
      const ratio = getContrastRatio(lightModeColors.foreground, lightModeColors.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('gray-500 on white background meets WCAG AA for large text (3:1)', () => {
      const ratio = getContrastRatio(lightModeColors.gray500, lightModeColors.background);
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });
  });

  describe('Dark Mode Contrast Ratios', () => {
    it('text-gray-600 on dark background meets WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(darkModeColors.gray600, darkModeColors.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('text-gray-700 on dark background meets WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(darkModeColors.gray700, darkModeColors.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('text-gray-900 on dark background meets WCAG AAA (7:1)', () => {
      const ratio = getContrastRatio(darkModeColors.gray900, darkModeColors.background);
      expect(ratio).toBeGreaterThanOrEqual(7.0);
    });

    it('foreground text on dark background meets WCAG AA', () => {
      const ratio = getContrastRatio(darkModeColors.foreground, darkModeColors.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Color Accessibility Validation', () => {
    it('all gray scale colors are defined', () => {
      const grayLevels = [100, 200, 300, 400, 500, 600, 700, 800, 900];
      
      grayLevels.forEach(level => {
        const lightKey = `gray${level}` as keyof typeof lightModeColors;
        const darkKey = `gray${level}` as keyof typeof darkModeColors;
        
        expect(lightModeColors[lightKey]).toBeDefined();
        expect(darkModeColors[darkKey]).toBeDefined();
        
        // Ensure they're valid hex colors
        expect(lightModeColors[lightKey]).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(darkModeColors[darkKey]).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('provides sufficient contrast for common text combinations', () => {
      const textCombinations = [
        // Common text on background combinations
        { text: lightModeColors.gray600, bg: lightModeColors.background, name: 'gray-600 on white' },
        { text: lightModeColors.gray700, bg: lightModeColors.background, name: 'gray-700 on white' },
        { text: lightModeColors.gray900, bg: lightModeColors.background, name: 'gray-900 on white' },
        { text: lightModeColors.foreground, bg: lightModeColors.background, name: 'foreground on white' },
        
        // Dark mode combinations
        { text: darkModeColors.gray600, bg: darkModeColors.background, name: 'dark gray-600 on dark bg' },
        { text: darkModeColors.gray700, bg: darkModeColors.background, name: 'dark gray-700 on dark bg' },
        { text: darkModeColors.foreground, bg: darkModeColors.background, name: 'dark foreground on dark bg' },
      ];

      textCombinations.forEach(({ text, bg, name }) => {
        const ratio = getContrastRatio(text, bg);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
        console.log(`✓ ${name}: ${ratio.toFixed(2)}:1`);
      });
    });
  });

  describe('Browser Compatibility', () => {
    it('uses standard hex colors instead of OKLCH', () => {
      const allColors = { ...lightModeColors, ...darkModeColors };
      
      Object.entries(allColors).forEach(([name, color]) => {
        // Ensure all colors are hex format, not OKLCH
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(color).not.toContain('oklch');
        expect(color).not.toContain('hsl');
        expect(color).not.toContain('rgb');
      });
    });

    it('provides fallback colors for all gray scale levels', () => {
      const requiredLevels = [100, 200, 300, 400, 500, 600, 700, 800, 900];
      
      requiredLevels.forEach(level => {
        const lightKey = `gray${level}` as keyof typeof lightModeColors;
        const darkKey = `gray${level}` as keyof typeof darkModeColors;
        
        expect(lightModeColors[lightKey]).toBeTruthy();
        expect(darkModeColors[darkKey]).toBeTruthy();
        
        // Ensure light and dark versions are different
        expect(lightModeColors[lightKey]).not.toBe(darkModeColors[darkKey]);
      });
    });
  });
});
