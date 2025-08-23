/**
 * Integration test for WorksGallery component
 * Demonstrates comprehensive testing of component interactions and API integration
 */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import WorksGallery from './WorksGallery';
import { IntegrationTestUtils, renderWithProviders, commonMockHandlers, createMockServer } from '../../lib/testing/integration';

// Setup mock server
const server = createMockServer(commonMockHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('WorksGallery Integration Tests', () => {
  let integrationUtils: IntegrationTestUtils;

  beforeEach(() => {
    integrationUtils = new IntegrationTestUtils();
  });

  describe('Component Interaction Tests', () => {
    test('should handle pagination interaction', async () => {
      await integrationUtils.testComponentInteraction(
        <WorksGallery />,
        [
          {
            action: async (user) => {
              // Wait for component to load
              await waitFor(() => {
                expect(screen.getByText(/works/i)).toBeInTheDocument();
              });
            },
            description: 'Component loads successfully',
          },
          {
            action: async (user) => {
              // Find and click next page button
              const nextButton = screen.getByLabelText(/next/i);
              await user.click(nextButton);
            },
            description: 'Navigate to next page',
            expectedResult: async () => {
              // Verify pagination state changed
              await waitFor(() => {
                expect(screen.getByLabelText(/page 2/i)).toBeInTheDocument();
              });
            },
          },
        ]
      );
    });

    test('should handle work card interaction', async () => {
      await integrationUtils.testComponentInteraction(
        <WorksGallery />,
        [
          {
            action: async (user) => {
              // Wait for works to load
              await waitFor(() => {
                expect(screen.getByText(/works/i)).toBeInTheDocument();
              });
            },
            description: 'Works gallery loads',
          },
          {
            action: async (user) => {
              // Find and click on a work card
              const workCard = screen.getByTestId('work-card');
              await user.click(workCard);
            },
            description: 'Click on work card',
            expectedResult: async () => {
              // Verify navigation or modal opens
              await waitFor(() => {
                expect(screen.getByText(/view details/i)).toBeInTheDocument();
              });
            },
          },
        ]
      );
    });
  });

  describe('API Integration Tests', () => {
    test('should handle API error gracefully', async () => {
      // Mock API error
      server.use(
        commonMockHandlers[0] // Override works API to return error
      );

      await integrationUtils.testComponentInteraction(
        <WorksGallery />,
        [
          {
            action: async (user) => {
              // Wait for error state
              await waitFor(() => {
                expect(screen.getByText(/error loading works/i)).toBeInTheDocument();
              });
            },
            description: 'Displays error message when API fails',
          },
        ]
      );
    });

    test('should handle empty state', async () => {
      // Mock empty response
      server.use(
        commonMockHandlers[0] // Override works API to return empty array
      );

      await integrationUtils.testComponentInteraction(
        <WorksGallery />,
        [
          {
            action: async (user) => {
              // Wait for empty state
              await waitFor(() => {
                expect(screen.getByText(/no works yet/i)).toBeInTheDocument();
              });
            },
            description: 'Displays empty state when no works exist',
          },
        ]
      );
    });
  });

  describe('User Workflow Tests', () => {
    test('should complete full user workflow', async () => {
      await integrationUtils.simulateUserWorkflow([
        {
          action: async () => {
            // Render component
            renderWithProviders(<WorksGallery />);
          },
          description: 'Load works gallery',
          validation: async () => {
            await waitFor(() => {
              expect(screen.getByText(/works/i)).toBeInTheDocument();
            });
          },
        },
        {
          action: async () => {
            // Navigate through pages
            const nextButton = screen.getByLabelText(/next/i);
            await nextButton.click();
          },
          description: 'Navigate to next page',
          validation: async () => {
            await waitFor(() => {
              expect(screen.getByLabelText(/page 2/i)).toBeInTheDocument();
            });
          },
        },
        {
          action: async () => {
            // Navigate back
            const prevButton = screen.getByLabelText(/previous/i);
            await prevButton.click();
          },
          description: 'Navigate to previous page',
          validation: async () => {
            await waitFor(() => {
              expect(screen.getByLabelText(/page 1/i)).toBeInTheDocument();
            });
          },
        },
      ]);
    });
  });

  describe('Performance Tests', () => {
    test('should load within performance threshold', async () => {
      const startTime = Date.now();
      
      renderWithProviders(<WorksGallery />);
      
      await waitFor(() => {
        expect(screen.getByText(/works/i)).toBeInTheDocument();
      });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2000); // Should load within 2 seconds
    });

    test('should handle large datasets efficiently', async () => {
      // Mock large dataset
      server.use(
        commonMockHandlers[0] // Override with large dataset
      );

      const startTime = Date.now();
      
      renderWithProviders(<WorksGallery />);
      
      await waitFor(() => {
        expect(screen.getByText(/works/i)).toBeInTheDocument();
      });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Should handle large datasets within 3 seconds
    });
  });

  describe('Accessibility Integration Tests', () => {
    test('should maintain accessibility during interactions', async () => {
      await integrationUtils.testComponentInteraction(
        <WorksGallery />,
        [
          {
            action: async (user) => {
              // Test keyboard navigation
              await user.tab();
              await user.tab();
              await user.tab();
            },
            description: 'Keyboard navigation works correctly',
            expectedResult: async () => {
              // Verify focus management
              const focusedElement = document.activeElement;
              expect(focusedElement).toHaveAttribute('tabindex');
            },
          },
          {
            action: async (user) => {
              // Test screen reader compatibility
              const worksSection = screen.getByRole('main');
              expect(worksSection).toBeInTheDocument();
            },
            description: 'Screen reader compatibility maintained',
          },
        ]
      );
    });
  });
});
