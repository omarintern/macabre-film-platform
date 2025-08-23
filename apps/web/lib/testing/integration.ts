/**
 * Integration testing utilities for comprehensive component and API testing
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { userEvent } from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Integration test configuration
export const INTEGRATION_CONFIG = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retryAttempts: 3,
};

// Custom render function for integration tests
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Integration test utilities
export class IntegrationTestUtils {
  private user = userEvent.setup();

  /**
   * Simulate a complete user workflow
   */
  async simulateUserWorkflow(steps: Array<{
    action: () => Promise<void>;
    description: string;
    validation?: () => Promise<void>;
  }>) {
    for (const step of steps) {
      try {
        console.log(`[INTEGRATION] Executing: ${step.description}`);
        await step.action();
        
        if (step.validation) {
          await step.validation();
        }
        
        console.log(`[INTEGRATION] ✅ Completed: ${step.description}`);
      } catch (error) {
        console.error(`[INTEGRATION] ❌ Failed: ${step.description}`, error);
        throw error;
      }
    }
  }

  /**
   * Test component interaction patterns
   */
  async testComponentInteraction(
    component: ReactElement,
    interactions: Array<{
      action: (user: ReturnType<typeof userEvent.setup>) => Promise<void>;
      description: string;
      expectedResult?: () => Promise<void>;
    }>
  ) {
    const { container } = renderWithProviders(component);

    for (const interaction of interactions) {
      try {
        console.log(`[INTERACTION] Testing: ${interaction.description}`);
        await interaction.action(this.user);
        
        if (interaction.expectedResult) {
          await interaction.expectedResult();
        }
        
        console.log(`[INTERACTION] ✅ Passed: ${interaction.description}`);
      } catch (error) {
        console.error(`[INTERACTION] ❌ Failed: ${interaction.description}`, error);
        throw error;
      }
    }
  }

  /**
   * Test API integration patterns
   */
  async testAPIIntegration(
    apiEndpoint: string,
    testCases: Array<{
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      expectedStatus: number;
      expectedData?: any;
      description: string;
    }>
  ) {
    for (const testCase of testCases) {
      try {
        console.log(`[API] Testing: ${testCase.description}`);
        
        const response = await fetch(`${INTEGRATION_CONFIG.apiBaseUrl}${apiEndpoint}`, {
          method: testCase.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: testCase.body ? JSON.stringify(testCase.body) : undefined,
        });

        expect(response.status).toBe(testCase.expectedStatus);
        
        if (testCase.expectedData) {
          const data = await response.json();
          expect(data).toMatchObject(testCase.expectedData);
        }
        
        console.log(`[API] ✅ Passed: ${testCase.description}`);
      } catch (error) {
        console.error(`[API] ❌ Failed: ${testCase.description}`, error);
        throw error;
      }
    }
  }

  /**
   * Test form submission workflows
   */
  async testFormSubmission(
    formComponent: ReactElement,
    formData: Record<string, any>,
    expectedOutcome: {
      success?: boolean;
      error?: string;
      redirect?: string;
    }
  ) {
    const { container } = renderWithProviders(formComponent);
    
    // Fill form fields
    for (const [fieldName, value] of Object.entries(formData)) {
      const field = container.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
      if (field) {
        await this.user.type(field, value);
      }
    }

    // Submit form
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      await this.user.click(submitButton);
    }

    // Wait for form processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate outcome
    if (expectedOutcome.success) {
      // Check for success message or redirect
      const successElement = container.querySelector('[data-testid="success-message"]');
      expect(successElement).toBeInTheDocument();
    }

    if (expectedOutcome.error) {
      // Check for error message
      const errorElement = container.querySelector('[data-testid="error-message"]');
      expect(errorElement).toHaveTextContent(expectedOutcome.error);
    }
  }

  /**
   * Test navigation workflows
   */
  async testNavigation(
    navigationComponent: ReactElement,
    navigationSteps: Array<{
      target: string;
      expectedPath?: string;
      description: string;
    }>
  ) {
    const { container } = renderWithProviders(navigationComponent);

    for (const step of navigationSteps) {
      try {
        console.log(`[NAVIGATION] Testing: ${step.description}`);
        
        const link = container.querySelector(`[href="${step.target}"]`) as HTMLAnchorElement;
        if (link) {
          await this.user.click(link);
          
          // Wait for navigation
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (step.expectedPath) {
            // Validate navigation occurred
            expect(window.location.pathname).toBe(step.expectedPath);
          }
        }
        
        console.log(`[NAVIGATION] ✅ Passed: ${step.description}`);
      } catch (error) {
        console.error(`[NAVIGATION] ❌ Failed: ${step.description}`, error);
        throw error;
      }
    }
  }
}

// Mock Service Worker setup for API mocking
export const createMockServer = (handlers: any[]) => {
  return setupServer(...handlers);
};

// Common API mock handlers
export const commonMockHandlers = [
  // Works API
  rest.get(`${INTEGRATION_CONFIG.apiBaseUrl}/works`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        works: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      })
    );
  }),

  // Tags API
  rest.get(`${INTEGRATION_CONFIG.apiBaseUrl}/tags`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        tags: [],
      })
    );
  }),

  // Auth API
  rest.post(`${INTEGRATION_CONFIG.apiBaseUrl}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          role: 'CREATOR',
        },
        token: 'mock-jwt-token',
      })
    );
  }),
];

// Integration test helpers
export const integrationHelpers = {
  /**
   * Wait for async operations to complete
   */
  waitFor: (condition: () => boolean, timeout = 5000) => {
    return new Promise<void>((resolve, reject) => {
      const startTime = Date.now();
      
      const checkCondition = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Condition not met within timeout'));
        } else {
          setTimeout(checkCondition, 100);
        }
      };
      
      checkCondition();
    });
  },

  /**
   * Retry operation with exponential backoff
   */
  retry: async <T>(
    operation: () => Promise<T>,
    maxAttempts = 3,
    baseDelay = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  },
};

// Export default utilities
export default {
  renderWithProviders,
  IntegrationTestUtils,
  createMockServer,
  commonMockHandlers,
  integrationHelpers,
  INTEGRATION_CONFIG,
};
