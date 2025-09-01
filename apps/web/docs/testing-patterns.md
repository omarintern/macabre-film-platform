# Testing Patterns and Requirements

## Overview

This document outlines the testing patterns, requirements, and best practices for the Macabre Film platform. Our testing strategy follows a pragmatic approach using Jest and React Testing Library, with a focus on user behavior rather than implementation details.

## Testing Philosophy

### Core Principles

1. **User-Centric Testing**: Test behavior, not implementation
2. **Accessibility First**: All tests must consider accessibility requirements
3. **Performance Aware**: Monitor performance impact of components
4. **Maintainable**: Write tests that are easy to understand and maintain
5. **Comprehensive**: Cover unit, integration, and end-to-end scenarios

### Testing Pyramid

```
    E2E Tests (Few)
       /    \
      /      \
Integration Tests (Some)
     /        \
    /          \
  Unit Tests (Many)
```

## Testing Categories

### 1. Unit Tests

**Purpose**: Test individual functions, components, and utilities in isolation.

**Location**: Co-located with components as `*.test.tsx` files.

**Coverage Requirements**:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

#### Unit Test Patterns

**Component Testing**:
```tsx
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('shows loading state', () => {
    render(<Button loading>Submitting...</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();
  });

  test('meets accessibility standards', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Hook Testing**:
```tsx
import { renderHook, act } from '@testing-library/react';
import { useWorks } from './useWorks';

describe('useWorks Hook', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => useWorks());
    
    expect(result.current.works).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('fetches works successfully', async () => {
    const mockWorks = [{ id: '1', title: 'Test Work' }];
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ works: mockWorks }),
    } as Response);

    const { result } = renderHook(() => useWorks());

    await act(async () => {
      await result.current.fetchWorks();
    });

    expect(result.current.works).toEqual(mockWorks);
    expect(result.current.loading).toBe(false);
  });
});
```

**Utility Function Testing**:
```tsx
import { formatDate, validateEmail } from './utils';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('January 15, 2024');
    });

    test('handles invalid date', () => {
      expect(formatDate(null)).toBe('Invalid date');
    });
  });

  describe('validateEmail', () => {
    test('validates correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    test('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });
});
```

### 2. Integration Tests

**Purpose**: Test component interactions and API integration.

**Location**: `*.integration.test.tsx` files.

**Coverage Requirements**:
- Test component interactions
- API integration scenarios
- Form submission workflows
- Navigation patterns

#### Integration Test Patterns

**Component Interaction Testing**:
```tsx
import { IntegrationTestUtils } from '@/lib/testing/integration';

describe('WorksGallery Integration', () => {
  let integrationUtils: IntegrationTestUtils;

  beforeEach(() => {
    integrationUtils = new IntegrationTestUtils();
  });

  test('handles pagination workflow', async () => {
    await integrationUtils.testComponentInteraction(
      <WorksGallery />,
      [
        {
          action: async (user) => {
            await user.click(screen.getByLabelText(/next/i));
          },
          description: 'Navigate to next page',
          expectedResult: async () => {
            expect(screen.getByLabelText(/page 2/i)).toBeInTheDocument();
          },
        },
      ]
    );
  });

  test('handles work card interaction', async () => {
    await integrationUtils.testComponentInteraction(
      <WorksGallery />,
      [
        {
          action: async (user) => {
            const workCard = screen.getByTestId('work-card');
            await user.click(workCard);
          },
          description: 'Click on work card',
          expectedResult: async () => {
            expect(screen.getByText(/view details/i)).toBeInTheDocument();
          },
        },
      ]
    );
  });
});
```

**API Integration Testing**:
```tsx
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/works', (req, res, ctx) => {
    return res(ctx.json({ works: [] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Integration', () => {
  test('handles API error gracefully', async () => {
    server.use(
      rest.get('/api/works', (req, res, ctx) => {
        return res(ctx.status(500));
      })
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
});
```

### 3. End-to-End Tests

**Purpose**: Test complete user journeys from start to finish.

**Location**: `*.e2e.test.tsx` files.

**Coverage Requirements**:
- Critical user paths
- Complete workflows
- Cross-browser compatibility
- Performance validation

#### E2E Test Patterns

**User Journey Testing**:
```tsx
import { E2ETestUtils } from '@/lib/testing/e2e';

describe('User Registration E2E', () => {
  let e2eUtils: E2ETestUtils;

  beforeEach(() => {
    e2eUtils = new E2ETestUtils();
  });

  test('complete registration flow', async () => {
    await e2eUtils.testUserJourney({
      name: 'User Registration',
      steps: [
        {
          action: async () => {
            // Navigate to registration page
            render(<RegistrationPage />);
          },
          description: 'Navigate to registration',
          accessibilityCheck: true,
        },
        {
          action: async () => {
            // Fill and submit form
            const user = userEvent.setup();
            await user.type(screen.getByLabelText(/email/i), 'test@example.com');
            await user.type(screen.getByLabelText(/password/i), 'password123');
            await user.click(screen.getByRole('button', { name: /register/i }));
          },
          description: 'Submit registration',
          validation: async () => {
            expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
          },
        },
      ],
    });
  });
});
```

**Form Submission Testing**:
```tsx
test('work submission workflow', async () => {
  await e2eUtils.testFormSubmission(
    <WorkSubmissionForm />,
    {
      formData: {
        title: 'Test Work',
        description: 'Test description',
        tags: ['horror', 'thriller'],
      },
      expectedOutcome: {
        success: true,
      },
      accessibilityCheck: true,
    }
  );
});
```

### 4. Performance Tests

**Purpose**: Ensure components meet performance requirements.

**Location**: `*.performance.test.tsx` files.

**Coverage Requirements**:
- Component render performance
- Memory usage monitoring
- Bundle size analysis
- Performance regression testing

#### Performance Test Patterns

**Component Performance Testing**:
```tsx
import { PerformanceTestUtils } from '@/lib/testing/performance';

describe('Component Performance', () => {
  let perfUtils: PerformanceTestUtils;

  beforeEach(() => {
    perfUtils = new PerformanceTestUtils();
  });

  test('renders within performance threshold', async () => {
    const metrics = await perfUtils.measureComponentRender(
      <WorksGallery />,
      { iterations: 20, warmup: true }
    );

    const validation = perfUtils.validatePerformance(metrics);
    expect(validation.passed).toBe(true);
  });

  test('handles large datasets efficiently', async () => {
    const largeWorks = Array.from({ length: 100 }, (_, i) => ({
      id: `work-${i}`,
      title: `Work ${i}`,
      description: `Description ${i}`,
    }));

    const metrics = await perfUtils.measureComponentRender(
      <WorksGallery works={largeWorks} />,
      { iterations: 10 }
    );

    expect(metrics.renderTime).toBeLessThan(100); // 100ms threshold
  });
});
```

## Testing Utilities

### Available Testing Utilities

1. **Integration Testing**: `lib/testing/integration.ts`
   - Component interaction testing
   - API integration testing
   - Form submission testing
   - Navigation testing

2. **E2E Testing**: `lib/testing/e2e.ts`
   - User journey testing
   - Accessibility integration
   - Performance monitoring
   - Responsive design testing

3. **Performance Testing**: `lib/testing/performance.ts`
   - Component render performance
   - Memory usage monitoring
   - Bundle size analysis
   - Performance benchmarking

4. **Accessibility Testing**: `lib/testing/accessibility.ts`
   - WCAG 2.1 AA compliance
   - Screen reader testing
   - Keyboard navigation testing

### Custom Render Functions

```tsx
// For integration tests
import { renderWithProviders } from '@/lib/testing/integration';

// For E2E tests
import { renderForE2E } from '@/lib/testing/e2e';

// For performance tests
import { render } from '@testing-library/react';
```

## Mocking Strategies

### API Mocking

Use MSW (Mock Service Worker) for API mocking:

```tsx
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/works', (req, res, ctx) => {
    return res(ctx.json({ works: [] }));
  }),
  rest.post('/api/works', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Component Mocking

Mock external dependencies and complex components:

```tsx
// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '',
}));

// Mock external libraries
jest.mock('@/lib/api', () => ({
  fetchWorks: jest.fn(),
  createWork: jest.fn(),
}));
```

### Test Data Factories

Create reusable test data:

```tsx
// lib/testing/factories.ts
export const createMockWork = (overrides = {}) => ({
  id: 'test-work-id',
  title: 'Test Work',
  description: 'Test description',
  creatorId: 'test-creator-id',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'CREATOR',
  createdAt: new Date().toISOString(),
  ...overrides,
});
```

## Testing Best Practices

### Do's

✅ **Test user behavior, not implementation**
```tsx
// Good
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

// Bad
expect(component.props.onClick).toBeDefined();
```

✅ **Use semantic queries**
```tsx
// Good
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email address/i);

// Bad
screen.getByTestId('submit-button');
```

✅ **Test accessibility**
```tsx
// Always include accessibility tests
test('meets accessibility standards', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

✅ **Use descriptive test names**
```tsx
// Good
test('displays error message when form submission fails', () => {});

// Bad
test('handles error', () => {});
```

✅ **Mock external dependencies**
```tsx
// Mock API calls, external libraries, etc.
jest.mock('@/lib/api');
```

### Don'ts

❌ **Don't test implementation details**
```tsx
// Bad
expect(component.state.isLoading).toBe(true);
```

❌ **Don't use non-semantic queries**
```tsx
// Bad
screen.getByTestId('button');
screen.getByClassName('btn');
```

❌ **Don't skip accessibility testing**
```tsx
// Bad - Missing accessibility tests
test('renders correctly', () => {
  render(<Component />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

❌ **Don't write brittle tests**
```tsx
// Bad - Too specific
expect(screen.getByText('Hello World')).toBeInTheDocument();

// Good - More flexible
expect(screen.getByText(/hello/i)).toBeInTheDocument();
```

## Testing Commands

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "jest --testPathPattern=e2e",
    "test:performance": "jest --testPathPattern=performance",
    "test:accessibility": "jest --testPathPattern=accessibility"
  }
}
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:integration
npm run test:e2e
npm run test:performance

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run test:performance
```

## Troubleshooting

### Common Issues

1. **Tests failing due to async operations**
   - Use `waitFor` for async operations
   - Ensure proper cleanup in `afterEach`

2. **Mock not working**
   - Check mock setup in `jest.setup.js`
   - Verify import paths

3. **Accessibility violations**
   - Review component markup
   - Add missing ARIA attributes
   - Check color contrast

4. **Performance test failures**
   - Adjust performance thresholds
   - Check for memory leaks
   - Optimize component rendering

### Debugging Tips

```tsx
// Debug test output
screen.debug();

// Debug specific element
screen.debug(screen.getByRole('button'));

// Log test data
console.log('Test data:', testData);
```

## Conclusion

Following these testing patterns and requirements ensures:
- High code quality and reliability
- Accessibility compliance
- Performance optimization
- Maintainable test suites
- Comprehensive coverage

Remember: **Good tests are an investment in code quality and developer productivity.**

