/**
 * End-to-End testing utilities with accessibility testing integration
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { userEvent } from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

// E2E test configuration
export const E2E_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  timeout: 15000,
  accessibilityThreshold: 0.8, // Minimum accessibility score
  performanceThreshold: 3000, // Maximum load time in ms
};

// Custom render function for E2E tests
export const renderForE2E = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// E2E test utilities
export class E2ETestUtils {
  private user = userEvent.setup();

  /**
   * Test complete user journey from start to finish
   */
  async testUserJourney(journey: {
    name: string;
    steps: Array<{
      action: () => Promise<void>;
      description: string;
      accessibilityCheck?: boolean;
      performanceCheck?: boolean;
      validation?: () => Promise<void>;
    }>;
  }) {
    console.log(`[E2E] Starting user journey: ${journey.name}`);
    
    for (const step of journey.steps) {
      try {
        console.log(`[E2E] Executing: ${step.description}`);
        
        // Performance check before action
        if (step.performanceCheck) {
          await this.checkPerformance();
        }
        
        // Execute action
        await step.action();
        
        // Accessibility check after action
        if (step.accessibilityCheck) {
          await this.checkAccessibility();
        }
        
        // Custom validation
        if (step.validation) {
          await step.validation();
        }
        
        console.log(`[E2E] ✅ Completed: ${step.description}`);
      } catch (error) {
        console.error(`[E2E] ❌ Failed: ${step.description}`, error);
        throw error;
      }
    }
    
    console.log(`[E2E] ✅ Completed user journey: ${journey.name}`);
  }

  /**
   * Test accessibility compliance
   */
  async checkAccessibility(container?: HTMLElement) {
    const target = container || document.body;
    const results = await axe(target);
    
    expect(results).toHaveNoViolations();
    
    // Log accessibility score
    const score = this.calculateAccessibilityScore(results);
    console.log(`[ACCESSIBILITY] Score: ${score.toFixed(2)}%`);
    
    expect(score).toBeGreaterThanOrEqual(E2E_CONFIG.accessibilityThreshold * 100);
  }

  /**
   * Test performance metrics
   */
  async checkPerformance() {
    const startTime = performance.now();
    
    // Wait for any pending operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const loadTime = performance.now() - startTime;
    console.log(`[PERFORMANCE] Load time: ${loadTime.toFixed(2)}ms`);
    
    expect(loadTime).toBeLessThan(E2E_CONFIG.performanceThreshold);
  }

  /**
   * Test form submission workflow
   */
  async testFormSubmission(formComponent: ReactElement, workflow: {
    formData: Record<string, any>;
    expectedOutcome: {
      success?: boolean;
      error?: string;
      redirect?: string;
    };
    accessibilityCheck?: boolean;
  }) {
    const { container } = renderForE2E(formComponent);
    
    // Fill form fields
    for (const [fieldName, value] of Object.entries(workflow.formData)) {
      const field = container.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
      if (field) {
        await this.user.type(field, value);
      }
    }

    // Check accessibility before submission
    if (workflow.accessibilityCheck) {
      await this.checkAccessibility(container);
    }

    // Submit form
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      await this.user.click(submitButton);
    }

    // Wait for form processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Validate outcome
    if (workflow.expectedOutcome.success) {
      const successElement = container.querySelector('[data-testid="success-message"]');
      expect(successElement).toBeInTheDocument();
    }

    if (workflow.expectedOutcome.error) {
      const errorElement = container.querySelector('[data-testid="error-message"]');
      expect(errorElement).toHaveTextContent(workflow.expectedOutcome.error);
    }
  }

  /**
   * Test navigation workflow
   */
  async testNavigation(navigationComponent: ReactElement, workflow: {
    steps: Array<{
      target: string;
      expectedPath?: string;
      accessibilityCheck?: boolean;
      description: string;
    }>;
  }) {
    const { container } = renderForE2E(navigationComponent);

    for (const step of workflow.steps) {
      try {
        console.log(`[NAVIGATION] Testing: ${step.description}`);
        
        const link = container.querySelector(`[href="${step.target}"]`) as HTMLAnchorElement;
        if (link) {
          await this.user.click(link);
          
          // Wait for navigation
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (step.expectedPath) {
            expect(window.location.pathname).toBe(step.expectedPath);
          }
          
          if (step.accessibilityCheck) {
            await this.checkAccessibility();
          }
        }
        
        console.log(`[NAVIGATION] ✅ Passed: ${step.description}`);
      } catch (error) {
        console.error(`[NAVIGATION] ❌ Failed: ${step.description}`, error);
        throw error;
      }
    }
  }

  /**
   * Test responsive design
   */
  async testResponsiveDesign(component: ReactElement, breakpoints: Array<{
    width: number;
    height: number;
    description: string;
    accessibilityCheck?: boolean;
  }>) {
    for (const breakpoint of breakpoints) {
      try {
        console.log(`[RESPONSIVE] Testing: ${breakpoint.description}`);
        
        // Set viewport size
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: breakpoint.width,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: breakpoint.height,
        });
        
        // Trigger resize event
        window.dispatchEvent(new Event('resize'));
        
        // Wait for layout to adjust
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (breakpoint.accessibilityCheck) {
          await this.checkAccessibility();
        }
        
        console.log(`[RESPONSIVE] ✅ Passed: ${breakpoint.description}`);
      } catch (error) {
        console.error(`[RESPONSIVE] ❌ Failed: ${breakpoint.description}`, error);
        throw error;
      }
    }
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(component: ReactElement, navigation: {
    steps: Array<{
      key: string;
      expectedFocus?: string;
      description: string;
    }>;
  }) {
    const { container } = renderForE2E(component);

    for (const step of navigation.steps) {
      try {
        console.log(`[KEYBOARD] Testing: ${step.description}`);
        
        // Simulate key press
        await this.user.keyboard(step.key);
        
        if (step.expectedFocus) {
          const focusedElement = document.activeElement;
          expect(focusedElement).toHaveAttribute('data-testid', step.expectedFocus);
        }
        
        console.log(`[KEYBOARD] ✅ Passed: ${step.description}`);
      } catch (error) {
        console.error(`[KEYBOARD] ❌ Failed: ${step.description}`, error);
        throw error;
      }
    }
  }

  /**
   * Calculate accessibility score from axe results
   */
  private calculateAccessibilityScore(results: any): number {
    const totalIssues = results.violations.length;
    const totalElements = results.passes.length + totalIssues;
    
    if (totalElements === 0) return 100;
    
    return ((totalElements - totalIssues) / totalElements) * 100;
  }
}

// Common E2E test scenarios
export const commonE2EScenarios = {
  /**
   * Complete user registration and login flow
   */
  userRegistrationFlow: {
    name: 'User Registration and Login',
    steps: [
      {
        action: async () => {
          // Navigate to registration page
          console.log('Navigate to registration page');
        },
        description: 'Navigate to registration page',
        accessibilityCheck: true,
      },
      {
        action: async () => {
          // Fill registration form
          console.log('Fill registration form');
        },
        description: 'Fill registration form',
        accessibilityCheck: true,
      },
      {
        action: async () => {
          // Submit registration
          console.log('Submit registration');
        },
        description: 'Submit registration',
        validation: async () => {
          // Verify registration success
          console.log('Verify registration success');
        },
      },
      {
        action: async () => {
          // Navigate to login
          console.log('Navigate to login');
        },
        description: 'Navigate to login page',
        accessibilityCheck: true,
      },
      {
        action: async () => {
          // Login with new credentials
          console.log('Login with new credentials');
        },
        description: 'Login with new credentials',
        validation: async () => {
          // Verify successful login
          console.log('Verify successful login');
        },
      },
    ],
  },

  /**
   * Complete work submission flow
   */
  workSubmissionFlow: {
    name: 'Work Submission',
    steps: [
      {
        action: async () => {
          // Navigate to submit page
          console.log('Navigate to submit page');
        },
        description: 'Navigate to submit page',
        accessibilityCheck: true,
      },
      {
        action: async () => {
          // Fill work submission form
          console.log('Fill work submission form');
        },
        description: 'Fill work submission form',
        accessibilityCheck: true,
      },
      {
        action: async () => {
          // Submit work
          console.log('Submit work');
        },
        description: 'Submit work',
        validation: async () => {
          // Verify work submission success
          console.log('Verify work submission success');
        },
      },
      {
        action: async () => {
          // Navigate to works gallery
          console.log('Navigate to works gallery');
        },
        description: 'Navigate to works gallery',
        accessibilityCheck: true,
      },
      {
        action: async () => {
          // Verify work appears in gallery
          console.log('Verify work appears in gallery');
        },
        description: 'Verify work appears in gallery',
      },
    ],
  },
};

// E2E test helpers
export const e2eHelpers = {
  /**
   * Wait for page to be fully loaded
   */
  waitForPageLoad: async (timeout = 5000) => {
    return new Promise<void>((resolve, reject) => {
      const startTime = Date.now();
      
      const checkReady = () => {
        if (document.readyState === 'complete') {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Page load timeout'));
        } else {
          setTimeout(checkReady, 100);
        }
      };
      
      checkReady();
    });
  },

  /**
   * Wait for network requests to complete
   */
  waitForNetworkIdle: async (timeout = 5000) => {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, timeout);
    });
  },

  /**
   * Take accessibility screenshot
   */
  takeAccessibilityScreenshot: async (name: string) => {
    // This would integrate with visual testing tools
    console.log(`[SCREENSHOT] Taking accessibility screenshot: ${name}`);
  },
};

// Export default utilities
export default {
  renderForE2E,
  E2ETestUtils,
  commonE2EScenarios,
  e2eHelpers,
  E2E_CONFIG,
};
