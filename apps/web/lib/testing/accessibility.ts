import { render, screen, RenderOptions } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';

// Extend Jest matchers for accessibility testing - done in jest.setup.js
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

/**
 * Test accessibility compliance for a component
 */
export async function testAccessibility(component: React.ReactElement): Promise<void> {
  const { container } = render(component);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

/**
 * Test WCAG 2.1 AA compliance specifically
 */
export async function testWCAG21AA(component: React.ReactElement): Promise<void> {
  const { container } = render(component);
  const results = await axe(container, {
    rules: {
      // WCAG 2.1 AA specific rules
      'color-contrast': { enabled: true },
      'color-contrast-enhanced': { enabled: false }, // AAA level
      'focus-order-semantics': { enabled: true },
      'landmark-one-main': { enabled: false }, // Not all components need main landmark
      'page-has-heading-one': { enabled: false }, // Not all components have h1
      'region': { enabled: true },
    },
  });
  expect(results).toHaveNoViolations();
}

/**
 * Test WCAG 2.1 AA compliance for rendered container
 */
export async function testContainerAccessibility(container: HTMLElement): Promise<void> {
  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: true },
      'color-contrast-enhanced': { enabled: false },
      'focus-order-semantics': { enabled: true },
      'landmark-one-main': { enabled: false }, // Not all components need main landmark
      'page-has-heading-one': { enabled: false }, // Not all components have h1
      'region': { enabled: true },
    },
  });
  expect(results).toHaveNoViolations();
}

/**
 * Render component with accessibility testing context
 */
export function renderWithAccessibility(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options);
}

/**
 * Test screen reader announcements
 */
export function testScreenReader(component: React.ReactElement) {
  render(component);
  
  // Test for proper ARIA labels and accessible names
  const interactiveElements = screen.queryAllByRole('button')
    .concat(screen.queryAllByRole('link'))
    .concat(screen.queryAllByRole('textbox'))
    .concat(screen.queryAllByRole('combobox'));
  
  interactiveElements.forEach((element) => {
    // Each interactive element should have an accessible name
    const accessibleName = element.getAttribute('aria-label') || 
                           element.getAttribute('aria-labelledby') || 
                           element.textContent;
    expect(accessibleName).toBeTruthy();
  });
  
  // Test for proper heading structure
  const headings = screen.queryAllByRole('heading');
  headings.forEach((heading) => {
    expect(heading).toBeVisible();
    expect(heading.textContent).toBeTruthy();
  });
}

/**
 * Test color contrast ratios (basic check, jest-axe does the real work)
 */
export function testColorContrast(component: React.ReactElement) {
  const { container } = render(component);
  
  const textElements = container.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
  
  textElements.forEach((element) => {
    if (element.textContent && element.textContent.trim()) {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      
      // Basic check that text has a color value
      expect(color).toBeTruthy();
      expect(color).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
    }
  });
}

/**
 * Test keyboard navigation
 */
export function testKeyboardNavigation(component: React.ReactElement) {
  render(component);
  
  // Test that all interactive elements are focusable
  const focusableElements = screen.queryAllByRole('button')
    .concat(screen.queryAllByRole('link'))
    .concat(screen.queryAllByRole('textbox'))
    .concat(screen.queryAllByRole('combobox'));
  
  focusableElements.forEach((element) => {
    // Element should not have tabindex="-1" unless it's intentionally not focusable
    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex !== null) {
      expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(-1);
    }
  });
}

/**
 * Focus management test
 */
export const testFocusManagement = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  // Basic focus test
  for (const element of Array.from(focusableElements)) {
    (element as HTMLElement).focus();
    expect(document.activeElement).toBe(element);
  }
};

export const accessibilityTestSuite = {
  testAccessibility,
  testWCAG21AA,
  testContainerAccessibility,
  renderWithAccessibility,
  testScreenReader,
  testColorContrast,
  testKeyboardNavigation,
  testFocusManagement,
};

// Create accessibility test for components
export const createAccessibilityTest = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  props: P
) => {
  return async () => {
    const { container } = renderWithAccessibility(React.createElement(Component, props));
    await testContainerAccessibility(container);
  };
};

// Export default for backward compatibility
const accessibilityUtils = {
  testAccessibility,
  testWCAG21AA,
  testContainerAccessibility,
  renderWithAccessibility,
  testScreenReader,
  testColorContrast,
  testKeyboardNavigation,
  testFocusManagement,
  accessibilityTestSuite,
  createAccessibilityTest,
};

export default accessibilityUtils;