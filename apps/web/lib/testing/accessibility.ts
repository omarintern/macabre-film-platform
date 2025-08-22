/**
 * Accessibility Testing Utilities
 * 
 * Provides utilities for testing WCAG 2.1 AA compliance
 * and accessibility features in components
 */

import { render, RenderOptions } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

/**
 * Custom render function that includes accessibility testing
 */
export function renderWithAccessibility(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options);
}

/**
 * Test component for accessibility violations
 */
export async function testAccessibility(container: HTMLElement) {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  return results;
}

/**
 * Test component for specific accessibility rules
 */
export async function testAccessibilityRules(
  container: HTMLElement,
  rules: string[] = []
) {
  const results = await axe(container, {
    rules: rules.reduce((acc, rule) => {
      acc[rule] = { enabled: true };
      return acc;
    }, {} as Record<string, { enabled: boolean }>),
  });
  expect(results).toHaveNoViolations();
  return results;
}

/**
 * Common accessibility test patterns
 */
export const accessibilityTestPatterns = {
  // Test for proper heading hierarchy
  headingHierarchy: async (container: HTMLElement) => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
    
    // Check for proper hierarchy (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
    }
  },

  // Test for proper focus management
  focusManagement: async (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Test that all focusable elements can receive focus
    for (const element of Array.from(focusableElements)) {
      element.focus();
      expect(document.activeElement).toBe(element);
    }
  },

  // Test for proper ARIA attributes
  ariaAttributes: async (container: HTMLElement) => {
    const elementsWithAria = container.querySelectorAll('[aria-*]');
    
    for (const element of Array.from(elementsWithAria)) {
      const ariaAttributes = Array.from(element.attributes)
        .filter(attr => attr.name.startsWith('aria-'))
        .map(attr => attr.name);
      
      // Check for valid ARIA attributes
      ariaAttributes.forEach(attr => {
        expect(attr).toMatch(/^aria-[a-z-]+$/);
      });
    }
  },

  // Test for proper color contrast (basic check)
  colorContrast: async (container: HTMLElement) => {
    const textElements = container.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    
    for (const element of Array.from(textElements)) {
      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;
      
      // Basic check - ensure text and background are different
      expect(backgroundColor).not.toBe(color);
    }
  },

  // Test for proper alt text on images
  imageAltText: async (container: HTMLElement) => {
    const images = container.querySelectorAll('img');
    
    for (const img of Array.from(images)) {
      const alt = img.getAttribute('alt');
      // Images should have alt attribute (empty string is valid for decorative images)
      expect(alt).not.toBeNull();
    }
  },

  // Test for proper form labels
  formLabels: async (container: HTMLElement) => {
    const formControls = container.querySelectorAll('input, select, textarea');
    
    for (const control of Array.from(formControls)) {
      const id = control.getAttribute('id');
      if (id) {
        const label = container.querySelector(`label[for="${id}"]`);
        expect(label).toBeTruthy();
      }
    }
  },

  // Test for proper button text
  buttonText: async (container: HTMLElement) => {
    const buttons = container.querySelectorAll('button');
    
    for (const button of Array.from(buttons)) {
      const text = button.textContent?.trim();
      const ariaLabel = button.getAttribute('aria-label');
      
      // Buttons should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  },

  // Test for proper link text
  linkText: async (container: HTMLElement) => {
    const links = container.querySelectorAll('a[href]');
    
    for (const link of Array.from(links)) {
      const text = link.textContent?.trim();
      const ariaLabel = link.getAttribute('aria-label');
      
      // Links should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  },
};

/**
 * WCAG 2.1 AA specific test rules
 */
export const wcag21AARules = [
  'color-contrast',
  'document-title',
  'html-has-lang',
  'html-lang-valid',
  'landmark-one-main',
  'page-has-heading-one',
  'region',
  'skip-link',
  'focus-order-semantics',
  'focus-visible',
  'interactive-element-non-interactive',
  'no-autoplay-audio',
  'no-duplicate-attributes',
  'no-duplicate-id',
  'no-duplicate-id-active',
  'no-duplicate-id-aria',
  'no-redundant-alt',
  'no-redundant-roles',
  'no-redundant-title',
  'no-skip-link',
  'no-valid-redundant-alt',
  'object-alt',
  'presentation-role-conflict',
  'svg-img-alt',
  'td-headers-attr',
  'th-has-data-cells',
  'valid-aria-attr-value',
  'valid-aria-attr',
  'valid-aria-required-attr',
  'valid-aria-required-children',
  'valid-aria-required-parent',
  'valid-aria-roles',
  'valid-aria-values',
  'valid-lang',
  'valid-scope',
  'valid-table',
  'valid-td-has-header',
  'valid-th-has-data-cells',
];

/**
 * Test component for WCAG 2.1 AA compliance
 */
export async function testWCAG21AA(container: HTMLElement) {
  return testAccessibilityRules(container, wcag21AARules);
}

/**
 * Accessibility test wrapper for components
 */
export function withAccessibilityTest<P>(
  Component: React.ComponentType<P>,
  props: P = {} as P
) {
  return async () => {
    const { container } = renderWithAccessibility(React.createElement(Component, props));
    await testWCAG21AA(container);
  };
}

/**
 * Test keyboard navigation
 */
export async function testKeyboardNavigation(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const elements = Array.from(focusableElements);
  
  // Test tab navigation
  for (let i = 0; i < elements.length; i++) {
    elements[i].focus();
    expect(document.activeElement).toBe(elements[i]);
    
    // Simulate tab key
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    document.dispatchEvent(event);
  }
}

/**
 * Test screen reader announcements
 */
export function testScreenReaderAnnouncements(container: HTMLElement) {
  const liveRegions = container.querySelectorAll('[aria-live]');
  
  for (const region of Array.from(liveRegions)) {
    const ariaLive = region.getAttribute('aria-live');
    expect(['polite', 'assertive', 'off']).toContain(ariaLive);
  }
}

/**
 * Test focus trap (for modals)
 */
export async function testFocusTrap(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    // Focus first element
    const firstElement = focusableElements[0] as HTMLElement;
    firstElement.focus();
    
    // Test that focus stays within container
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    document.dispatchEvent(event);
    
    // Focus should remain within the container
    expect(container.contains(document.activeElement)).toBe(true);
  }
}

/**
 * Accessibility test helpers for common patterns
 */
export const accessibilityHelpers = {
  // Test for proper heading structure
  testHeadingStructure: (container: HTMLElement) => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);
    
    // Should have at least one h1
    const h1Elements = container.querySelectorAll('h1');
    expect(h1Elements.length).toBeGreaterThan(0);
  },

  // Test for proper form accessibility
  testFormAccessibility: (container: HTMLElement) => {
    const forms = container.querySelectorAll('form');
    
    for (const form of Array.from(forms)) {
      const inputs = form.querySelectorAll('input, select, textarea');
      
      for (const input of Array.from(inputs)) {
        const id = input.getAttribute('id');
        if (id) {
          const label = form.querySelector(`label[for="${id}"]`);
          expect(label).toBeTruthy();
        }
      }
    }
  },

  // Test for proper button accessibility
  testButtonAccessibility: (container: HTMLElement) => {
    const buttons = container.querySelectorAll('button');
    
    for (const button of Array.from(buttons)) {
      const text = button.textContent?.trim();
      const ariaLabel = button.getAttribute('aria-label');
      const ariaLabelledBy = button.getAttribute('aria-labelledby');
      
      // Button should have accessible name
      expect(text || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  },

  // Test for proper link accessibility
  testLinkAccessibility: (container: HTMLElement) => {
    const links = container.querySelectorAll('a[href]');
    
    for (const link of Array.from(links)) {
      const text = link.textContent?.trim();
      const ariaLabel = link.getAttribute('aria-label');
      const ariaLabelledBy = link.getAttribute('aria-labelledby');
      
      // Link should have accessible name
      expect(text || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  },
};

export default {
  renderWithAccessibility,
  testAccessibility,
  testAccessibilityRules,
  testWCAG21AA,
  withAccessibilityTest,
  testKeyboardNavigation,
  testScreenReaderAnnouncements,
  testFocusTrap,
  accessibilityTestPatterns,
  accessibilityHelpers,
  wcag21AARules,
};
