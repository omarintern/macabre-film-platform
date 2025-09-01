# Design System Documentation

## Overview

This design system establishes consistent UX patterns, accessibility standards, and technical architecture for the Film-BMAD platform. Inspired by the minimalist aesthetic of Barnsworthburning.net, it prioritizes content-forward design with WCAG 2.1 AA compliance.

## Core Principles

### 1. Minimalist Aesthetic
- Clean, uncluttered interfaces
- Content as the primary focus
- Limited color palette for emphasis
- Strong typography hierarchy

### 2. Accessibility First
- WCAG 2.1 AA compliance baseline
- Screen reader optimization
- Keyboard navigation support
- Focus management and visible indicators

### 3. Mobile-First Responsive Design
- Progressive enhancement approach
- Touch-friendly interface elements
- Optimized loading times
- Consistent experience across devices

### 4. Technical Excellence
- Serverless architecture optimization
- Performance monitoring
- Type-safe component system
- Comprehensive testing strategy

## Design Tokens

### Color Palette

#### Primary Colors
```typescript
import { colors } from '@/components/ui/design-system/tokens';

// Usage examples
backgroundColor: colors.primary[50]    // Lightest background
color: colors.text.primary            // Main text color
borderColor: colors.border.light      // Subtle borders
```

#### Semantic Colors
```typescript
// Success states
color: colors.semantic.success

// Error states
color: colors.semantic.error

// Warning states
color: colors.semantic.warning

// Information states
color: colors.semantic.info
```

### Typography

#### Font Families
- **Sans**: Inter (primary), system-ui fallback
- **Mono**: JetBrains Mono (code, technical content)

#### Font Sizes (Mobile-first scale)
```typescript
import { typography } from '@/components/ui/design-system/tokens';

// Usage examples
fontSize: typography.fontSize.base     // 16px - Body text
fontSize: typography.fontSize.lg       // 18px - Large body
fontSize: typography.fontSize.xl       // 20px - Subheadings
fontSize: typography.fontSize['2xl']   // 24px - Headings
fontSize: typography.fontSize['3xl']   // 30px - Large headings
```

#### Font Weights
```typescript
fontWeight: typography.fontWeight.normal    // 400 - Body text
fontWeight: typography.fontWeight.medium    // 500 - Emphasis
fontWeight: typography.fontWeight.semibold  // 600 - Subheadings
fontWeight: typography.fontWeight.bold      // 700 - Headings
```

### Spacing System

4px grid-based spacing system:
```typescript
import { spacing } from '@/components/ui/design-system/tokens';

// Usage examples
padding: spacing[4]    // 16px - Standard padding
margin: spacing[6]     // 24px - Section spacing
gap: spacing[2]        // 8px - Small gaps
```

### Border Radius

```typescript
import { borderRadius } from '@/components/ui/design-system/tokens';

// Usage examples
borderRadius: borderRadius.base    // 4px - Standard
borderRadius: borderRadius.lg      // 8px - Cards, buttons
borderRadius: borderRadius.xl      // 12px - Large components
borderRadius: borderRadius.full    // Rounded (pills, avatars)
```

### Shadows

```typescript
import { shadows } from '@/components/ui/design-system/tokens';

// Usage examples
boxShadow: shadows.sm    // Subtle elevation
boxShadow: shadows.md    // Medium elevation
boxShadow: shadows.lg    // High elevation
boxShadow: shadows.xl    // Maximum elevation
```

## Component System

### Button Component

#### Variants
- **Primary**: Main actions, high emphasis
- **Secondary**: Secondary actions, medium emphasis
- **Ghost**: Subtle actions, low emphasis
- **Danger**: Destructive actions

#### Usage
```tsx
import { Button } from '@/components/ui/design-system/Button';

<Button variant="primary" size="md">
  Submit
</Button>

<Button variant="secondary" size="sm">
  Cancel
</Button>

<Button variant="ghost" size="lg">
  Learn More
</Button>

<Button variant="danger" size="md">
  Delete
</Button>
```

#### Accessibility Features
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Screen reader announcements

### Form Components

#### Input Component
```tsx
import { Input } from '@/components/ui/design-system/Input';

<Input
  type="email"
  placeholder="Enter your email"
  error={hasError}
  disabled={isLoading}
  aria-describedby="email-error"
/>
```

#### Select Component
```tsx
import { Select } from '@/components/ui/design-system/Select';

<Select
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  placeholder="Select an option"
  aria-label="Choose an option"
/>
```

#### Textarea Component
```tsx
import { Textarea } from '@/components/ui/design-system/Textarea';

<Textarea
  placeholder="Enter your message"
  rows={4}
  maxLength={1000}
  aria-describedby="char-count"
/>
```

### Card Component

#### Variants
- **Default**: Standard cards with subtle border
- **Elevated**: Cards with shadow for emphasis

#### Usage
```tsx
import { Card } from '@/components/ui/design-system/Card';

<Card variant="default">
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Content>
    <p>Card content goes here</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>
```

### Modal/Dialog Component

#### Usage
```tsx
import { Modal } from '@/components/ui/design-system/Modal';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  aria-describedby="modal-description"
>
  <div id="modal-description">
    Modal content goes here
  </div>
  <Modal.Footer>
    <Button variant="primary">Confirm</Button>
    <Button variant="secondary">Cancel</Button>
  </Modal.Footer>
</Modal>
```

#### Accessibility Features
- Focus trap within modal
- Escape key to close
- Screen reader announcements
- Backdrop click to close

## Responsive Design

### Breakpoints
```typescript
import { breakpoints } from '@/components/ui/design-system/tokens';

// Mobile-first approach
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops
2xl: '1536px' // Large screens
```

### Responsive Utilities
```tsx
// Tailwind CSS responsive classes
<div className="
  w-full           // Mobile: full width
  md:w-1/2         // Tablet: half width
  lg:w-1/3         // Desktop: third width
  xl:w-1/4         // Large: quarter width
">
  Content
</div>
```

### Mobile-First Patterns
1. **Touch Targets**: Minimum 44px for interactive elements
2. **Spacing**: Generous spacing for touch interfaces
3. **Typography**: Readable font sizes on small screens
4. **Navigation**: Collapsible navigation for mobile

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal text**: 4.5:1 minimum ratio
- **Large text**: 3:1 minimum ratio
- **UI components**: 3:1 minimum ratio

#### Keyboard Navigation
- All interactive elements accessible via keyboard
- Visible focus indicators
- Logical tab order
- Skip links for main content

#### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Live regions for dynamic content
- Proper heading hierarchy

#### Focus Management
- Visible focus indicators
- Focus trap in modals
- Focus restoration after modal close
- Skip to main content links

### Testing Accessibility

#### Manual Testing
1. **Keyboard Navigation**: Tab through all interactive elements
2. **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
3. **Color Contrast**: Use browser dev tools or contrast checkers
4. **Focus Indicators**: Ensure visible focus on all elements

#### Automated Testing
```typescript
// Jest-axe for automated accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Performance Guidelines

### Component Optimization
- Lazy loading for heavy components
- Memoization for expensive calculations
- Code splitting for large bundles
- Image optimization and lazy loading

### Serverless Optimization
- API route optimization for Vercel
- Edge function considerations
- Database query optimization
- Caching strategies

### Monitoring
- Core Web Vitals tracking
- Performance budgets
- Error monitoring
- User experience metrics

## Testing Strategy

### Unit Testing
- Component behavior testing
- Hook testing
- Utility function testing
- Accessibility testing

### Integration Testing
- Component interaction testing
- API integration testing
- User flow testing
- Cross-browser testing

### End-to-End Testing
- Critical user journeys
- Accessibility compliance
- Performance testing
- Mobile responsiveness

## File Structure

```
components/ui/design-system/
├── tokens.ts              # Design tokens
├── Button.tsx             # Button component
├── Input.tsx              # Input component
├── Select.tsx             # Select component
├── Textarea.tsx           # Textarea component
├── Card.tsx               # Card component
├── Modal.tsx              # Modal component
├── Navigation.tsx         # Navigation component
├── Loading.tsx            # Loading component
├── Error.tsx              # Error component
└── index.ts               # Barrel exports

lib/testing/
├── accessibility.ts       # Accessibility testing utilities
├── render.tsx             # Custom render function
└── test-utils.ts          # Common test utilities

docs/design-system/
├── README.md              # This documentation
├── accessibility.md       # Accessibility guidelines
├── components.md          # Component usage examples
└── performance.md         # Performance guidelines
```

## Getting Started

### Installation
```bash
# Design tokens are already included in the project
# No additional installation required
```

### Basic Usage
```tsx
import { Button, Card, Input } from '@/components/ui/design-system';

function MyComponent() {
  return (
    <Card variant="default">
      <Card.Header>
        <Card.Title>My Form</Card.Title>
      </Card.Header>
      <Card.Content>
        <Input
          type="email"
          placeholder="Enter email"
          aria-label="Email address"
        />
        <Button variant="primary">
          Submit
        </Button>
      </Card.Content>
    </Card>
  );
}
```

### Customization
```tsx
// Extend design tokens for project-specific needs
import { colors } from '@/components/ui/design-system/tokens';

const customColors = {
  ...colors,
  brand: {
    primary: '#your-brand-color',
    secondary: '#your-secondary-color',
  },
};
```

## Contributing

### Adding New Components
1. Follow the established component structure
2. Include comprehensive accessibility features
3. Write unit tests with accessibility testing
4. Update documentation
5. Follow the mobile-first approach

### Design Token Updates
1. Maintain WCAG 2.1 AA compliance
2. Update documentation
3. Test across all components
4. Consider backward compatibility

### Accessibility Improvements
1. Test with screen readers
2. Verify keyboard navigation
3. Check color contrast ratios
4. Validate ARIA attributes

## Resources

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/browser-extensions/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Testing
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)
- [@testing-library/user-event](https://github.com/testing-library/user-event)
- [Playwright](https://playwright.dev/)

---

*This design system is a living document. Please contribute improvements and keep it updated as the project evolves.*

