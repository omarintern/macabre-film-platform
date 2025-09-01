# Testing Guidelines and Best Practices

## Overview

This document outlines the testing strategy, guidelines, and best practices for the Macabre Film platform. Our testing approach follows a pragmatic methodology using Jest and React Testing Library, with a focus on user behavior rather than implementation details.

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

## Testing Framework Setup

### Dependencies

```json
{
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@testing-library/user-event": "^14.0.0",
  "jest": "^29.0.0",
  "jest-axe": "^8.0.0",
  "msw": "^2.0.0"
}
```

### Configuration

- **Jest Config**: `jest.config.js` - Configured for Next.js with separate environments
- **Setup File**: `jest.setup.js` - Global test setup and mocks
- **Test Utilities**: Located in `lib/testing/` directory

## Testing Categories

### 1. Unit Tests

**Purpose**: Test individual functions, components, and utilities in isolation.

**Location**: Co-located with components as `*.test.tsx` files.

**Example**:
```typescript
import { render, screen } from '@testing-library/react';
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
});
```

**Best Practices**:
- Test one thing at a time
- Use descriptive test names
- Mock external dependencies
- Test error states and edge cases
- Include accessibility tests

### 2. Integration Tests

**Purpose**: Test component interactions and API integration.

**Location**: `*.integration.test.tsx` files.

**Example**:
```typescript
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
});
```

**Best Practices**:
- Test complete user workflows
- Mock API responses appropriately
- Test error handling scenarios
- Verify component state changes
- Include performance checks

### 3. End-to-End Tests

**Purpose**: Test complete user journeys from start to finish.

**Location**: `*.e2e.test.tsx` files.

**Example**:
```typescript
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
          },
          description: 'Navigate to registration',
          accessibilityCheck: true,
        },
        {
          action: async () => {
            // Fill and submit form
          },
          description: 'Submit registration',
          validation: async () => {
            // Verify success
          },
        },
      ],
    });
  });
});
```

**Best Practices**:
- Test critical user paths
- Include accessibility checks at each step
- Monitor performance metrics
- Test responsive design
- Verify data persistence

### 4. Performance Tests

**Purpose**: Ensure components meet performance requirements.

**Location**: `*.performance.test.tsx` files.

**Example**:
```typescript
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
});
```

**Best Practices**:
- Set realistic performance thresholds
- Test with realistic data volumes
- Monitor memory usage
- Test bundle size impact
- Include performance regression tests

## Accessibility Testing

### WCAG 2.1 AA Compliance

All components must meet WCAG 2.1 AA standards.

**Testing Tools**:
- `jest-axe` for automated accessibility testing
- Manual testing with screen readers
- Keyboard navigation testing

**Example**:
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('meets accessibility standards', async () => {
  const { container } = render(<WorksGallery />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Accessibility Checklist**:
- [ ] Semantic HTML structure
- [ ] Proper ARIA labels and roles
- [ ] Keyboard navigation support
- [ ] Color contrast compliance
- [ ] Screen reader compatibility
- [ ] Focus management
- [ ] Error message accessibility

## Testing Utilities

### Available Utilities

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

```typescript
// For integration tests
import { renderWithProviders } from '@/lib/testing/integration';

// For E2E tests
import { renderForE2E } from '@/lib/testing/e2e';

// For performance tests
import { render } from '@testing-library/react';
```

## Mocking Strategy

### API Mocking

Use MSW (Mock Service Worker) for API mocking:

```typescript
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
```

### Component Mocking

Mock external dependencies and complex components:

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));
```

## Test Data Management

### Test Data Factories

Create reusable test data:

```typescript
// lib/testing/factories.ts
export const createMockWork = (overrides = {}) => ({
  id: 'test-work-id',
  title: 'Test Work',
  description: 'Test description',
  creatorId: 'test-creator-id',
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'CREATOR',
  ...overrides,
});
```

### Test Database

Use in-memory database for integration tests:

```typescript
import { PrismaClient } from '@prisma/client';

const testDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

beforeEach(async () => {
  await testDb.work.deleteMany();
  await testDb.user.deleteMany();
});
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

## Code Coverage Requirements

### Minimum Coverage Thresholds

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Coverage Configuration

```javascript
// jest.config.js
collectCoverageFrom: [
  'app/**/*.{js,jsx,ts,tsx}',
  'components/**/*.{js,jsx,ts,tsx}',
  'lib/**/*.{js,jsx,ts,tsx}',
  '!**/*.d.ts',
  '!**/node_modules/**',
],
coverageThreshold: {
  global: {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
  },
},
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

## Best Practices Summary

### Do's

✅ **Test user behavior, not implementation**
```typescript
// Good
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

// Bad
expect(component.props.onClick).toBeDefined();
```

✅ **Use semantic queries**
```typescript
// Good
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email address/i);

// Bad
screen.getByTestId('submit-button');
```

✅ **Test accessibility**
```typescript
// Always include accessibility tests
test('meets accessibility standards', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

✅ **Use descriptive test names**
```typescript
// Good
test('displays error message when form submission fails', () => {});

// Bad
test('handles error', () => {});
```

✅ **Mock external dependencies**
```typescript
// Mock API calls, external libraries, etc.
jest.mock('@/lib/api');
```

### Don'ts

❌ **Don't test implementation details**
```typescript
// Bad
expect(component.state.isLoading).toBe(true);
```

❌ **Don't use non-semantic queries**
```typescript
// Bad
screen.getByTestId('button');
screen.getByClassName('btn');
```

❌ **Don't skip accessibility testing**
```typescript
// Bad - Missing accessibility tests
test('renders correctly', () => {
  render(<Component />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

❌ **Don't write brittle tests**
```typescript
// Bad - Too specific
expect(screen.getByText('Hello World')).toBeInTheDocument();

// Good - More flexible
expect(screen.getByText(/hello/i)).toBeInTheDocument();
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

```typescript
// Debug test output
screen.debug();

// Debug specific element
screen.debug(screen.getByRole('button'));

// Log test data
console.log('Test data:', testData);
```

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Accessibility Testing Guide](https://github.com/nickcolley/jest-axe)
- [MSW Documentation](https://mswjs.io/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Conclusion

Following these testing guidelines ensures:
- High code quality and reliability
- Accessibility compliance
- Performance optimization
- Maintainable test suites
- Comprehensive coverage

Remember: **Good tests are an investment in code quality and developer productivity.**

