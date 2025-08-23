# Component Usage Documentation

## Overview

This document provides comprehensive usage guidelines for all components in the Macabre Film platform design system. Each component follows our sophisticated minimalist aesthetic inspired by Barnsworthburning.net, with a focus on accessibility, performance, and maintainability.

## Design System Principles

### Core Principles
- **Minimalist Aesthetic**: Clean, uncluttered design with focus on content
- **Accessibility First**: WCAG 2.1 AA compliance for all components
- **Performance Optimized**: Efficient rendering and minimal bundle impact
- **Consistent API**: Predictable props and behavior across components
- **Mobile-First**: Responsive design with mobile-first approach

### Design Tokens
All components use centralized design tokens defined in `components/ui/design-system/tokens.ts`:
- **Colors**: Sophisticated palette with semantic color usage
- **Typography**: Consistent font hierarchy and spacing
- **Spacing**: Systematic spacing scale for consistent layouts
- **Shadows**: Subtle elevation and depth
- **Animations**: Smooth, purposeful micro-interactions

## Core Design System Components

### Button Component

**Location**: `components/ui/design-system/Button.tsx`

**Purpose**: Primary interactive element for user actions.

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**Usage Examples**:

```tsx
// Primary button (default)
<Button onClick={handleSubmit}>
  Submit Work
</Button>

// Secondary button
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>

// Ghost button for subtle actions
<Button variant="ghost" onClick={handleEdit}>
  Edit
</Button>

// Danger button for destructive actions
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>

// Loading state
<Button loading onClick={handleSubmit}>
  Submitting...
</Button>

// Disabled state
<Button disabled onClick={handleSubmit}>
  Submit Work
</Button>
```

**Best Practices**:
- Use primary variant for main actions
- Use secondary for alternative actions
- Use ghost for subtle, non-destructive actions
- Use danger for destructive actions
- Always provide meaningful button text
- Include loading states for async actions
- Ensure proper contrast ratios

### Card Component

**Location**: `components/ui/design-system/Card.tsx`

**Purpose**: Container for related content with consistent styling.

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}
```

**Usage Examples**:

```tsx
// Basic card
<Card>
  <h3>Work Title</h3>
  <p>Work description goes here...</p>
</Card>

// Interactive card
<Card interactive onClick={handleCardClick}>
  <h3>Clickable Work</h3>
  <p>Click to view details</p>
</Card>

// Card with custom padding
<Card padding="lg">
  <h3>Large Padding</h3>
  <p>Content with generous spacing</p>
</Card>

// Card with elevation
<Card elevation="md">
  <h3>Elevated Card</h3>
  <p>Card with medium shadow</p>
</Card>
```

**Best Practices**:
- Use consistent padding for related cards
- Apply interactive variant for clickable cards
- Use elevation sparingly for hierarchy
- Ensure proper contrast with background
- Keep content focused and concise

### Input Component

**Location**: `components/ui/design-system/Input.tsx`

**Purpose**: Text input field with consistent styling and validation.

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  className?: string;
}
```

**Usage Examples**:

```tsx
// Basic input
<Input
  placeholder="Enter work title"
  value={title}
  onChange={setTitle}
/>

// Input with label and helper text
<Input
  label="Email Address"
  type="email"
  placeholder="your@email.com"
  helperText="We'll never share your email"
  value={email}
  onChange={setEmail}
/>

// Input with error state
<Input
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  error="Password must be at least 8 characters"
/>

// Required input
<Input
  label="Work Title"
  required
  value={title}
  onChange={setTitle}
/>
```

**Best Practices**:
- Always provide labels for form inputs
- Use appropriate input types for validation
- Show helpful error messages
- Include helper text for complex fields
- Use placeholder text sparingly
- Ensure proper focus states

### Loading Component

**Location**: `components/ui/design-system/Loading.tsx`

**Purpose**: Loading indicator for async operations.

**Props**:
```typescript
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}
```

**Usage Examples**:

```tsx
// Basic loading spinner
<Loading />

// Loading with text
<Loading text="Loading works..." />

// Large loading spinner
<Loading size="lg" text="Submitting work..." />

// Small loading spinner
<Loading size="sm" />
```

**Best Practices**:
- Provide descriptive loading text
- Use appropriate size for context
- Show loading state immediately for user feedback
- Consider skeleton loading for content areas

### Error Component

**Location**: `components/ui/design-system/Error.tsx`

**Purpose**: Display error messages with consistent styling.

**Props**:
```typescript
interface ErrorProps {
  title?: string;
  message: string;
  retry?: () => void;
  className?: string;
}
```

**Usage Examples**:

```tsx
// Basic error message
<Error message="Failed to load works" />

// Error with title and retry
<Error
  title="Network Error"
  message="Unable to connect to server"
  retry={handleRetry}
/>

// Simple error message
<Error message="Something went wrong" />
```

**Best Practices**:
- Provide clear, actionable error messages
- Include retry functionality when appropriate
- Use consistent error styling
- Avoid technical jargon in user-facing messages

## Feature Components

### Navigation Component

**Location**: `components/ui/Navigation.tsx`

**Purpose**: Main navigation bar with user authentication and site navigation.

**Props**:
```typescript
interface NavigationProps {
  user?: User;
  onLogout?: () => void;
}
```

**Usage Examples**:

```tsx
// Navigation with authenticated user
<Navigation user={currentUser} onLogout={handleLogout} />

// Navigation without user (public)
<Navigation />
```

**Features**:
- Responsive design with mobile menu
- User authentication status display
- Logout functionality
- Brand logo and navigation links
- Sophisticated styling with backdrop blur

### WorksGallery Component

**Location**: `components/features/WorksGallery.tsx`

**Purpose**: Display a paginated gallery of creative works.

**Props**:
```typescript
interface WorksGalleryProps {
  works?: Work[];
  loading?: boolean;
  error?: string;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
}
```

**Usage Examples**:

```tsx
// Basic works gallery
<WorksGallery
  works={works}
  loading={loading}
  error={error}
  pagination={pagination}
  onPageChange={handlePageChange}
/>

// Gallery with loading state
<WorksGallery loading={true} />

// Gallery with error state
<WorksGallery error="Failed to load works" />
```

**Features**:
- Responsive grid layout
- Pagination controls
- Loading and error states
- Work card integration
- Sophisticated styling

### WorkCard Component

**Location**: `components/features/WorkCard.tsx`

**Purpose**: Display individual work information in a card format.

**Props**:
```typescript
interface WorkCardProps {
  work: Work;
  onClick?: () => void;
  showCreator?: boolean;
}
```

**Usage Examples**:

```tsx
// Basic work card
<WorkCard work={work} onClick={handleWorkClick} />

// Work card with creator info
<WorkCard work={work} showCreator={true} />

// Clickable work card
<WorkCard work={work} onClick={() => router.push(`/works/${work.id}`)} />
```

**Features**:
- Elegant card design with hover effects
- Creator information display
- Work metadata (tags, date, etc.)
- Responsive image handling
- Accessibility features

### TagList Component

**Location**: `components/features/TagList.tsx`

**Purpose**: Display a list of tags with filtering capabilities.

**Props**:
```typescript
interface TagListProps {
  tags?: Tag[];
  loading?: boolean;
  error?: string;
  onTagClick?: (tag: Tag) => void;
  selectedTags?: string[];
}
```

**Usage Examples**:

```tsx
// Basic tag list
<TagList tags={tags} onTagClick={handleTagClick} />

// Tag list with selected tags
<TagList
  tags={tags}
  selectedTags={selectedTags}
  onTagClick={handleTagClick}
/>

// Tag list with loading state
<TagList loading={true} />
```

**Features**:
- Responsive tag display
- Tag selection and filtering
- Loading and error states
- Tag count display
- Sophisticated styling

### ProfileEditForm Component

**Location**: `components/features/ProfileEditForm.tsx`

**Purpose**: Form for editing user profile information.

**Props**:
```typescript
interface ProfileEditFormProps {
  user?: User;
  onSubmit?: (data: ProfileFormData) => void;
  loading?: boolean;
  error?: string;
}
```

**Usage Examples**:

```tsx
// Profile edit form
<ProfileEditForm
  user={currentUser}
  onSubmit={handleProfileUpdate}
  loading={updating}
  error={updateError}
/>
```

**Features**:
- Comprehensive form validation
- Real-time error feedback
- Loading states
- Success confirmation
- Accessibility features

### WorkSubmissionForm Component

**Location**: `components/features/WorkSubmissionForm.tsx`

**Purpose**: Form for submitting new creative works.

**Props**:
```typescript
interface WorkSubmissionFormProps {
  onSubmit?: (data: WorkFormData) => void;
  loading?: boolean;
  error?: string;
  tags?: Tag[];
}
```

**Usage Examples**:

```tsx
// Work submission form
<WorkSubmissionForm
  onSubmit={handleWorkSubmit}
  loading={submitting}
  error={submitError}
  tags={availableTags}
/>
```

**Features**:
- Multi-step form process
- File upload handling
- Tag selection
- Form validation
- Success feedback

## Form Components

### FormField Component

**Location**: `components/ui/design-system/FormField.tsx`

**Purpose**: Wrapper for form inputs with consistent styling and validation.

**Props**:
```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

**Usage Examples**:

```tsx
<FormField label="Work Title" required error={titleError}>
  <Input
    value={title}
    onChange={setTitle}
    placeholder="Enter work title"
  />
</FormField>
```

### TextArea Component

**Location**: `components/ui/design-system/TextArea.tsx`

**Purpose**: Multi-line text input for longer content.

**Props**:
```typescript
interface TextAreaProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}
```

**Usage Examples**:

```tsx
<TextArea
  placeholder="Describe your work..."
  value={description}
  onChange={setDescription}
  rows={4}
  maxLength={500}
/>
```

## Layout Components

### Container Component

**Location**: `components/ui/design-system/Container.tsx`

**Purpose**: Responsive container for consistent page layouts.

**Props**:
```typescript
interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Usage Examples**:

```tsx
// Default container
<Container>
  <h1>Page Content</h1>
  <p>Content goes here...</p>
</Container>

// Wide container
<Container maxWidth="xl">
  <WorksGallery works={works} />
</Container>

// Container without padding
<Container padding="none">
  <HeroSection />
</Container>
```

## Accessibility Guidelines

### General Accessibility Requirements

All components must meet WCAG 2.1 AA standards:

1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Labels**: Provide descriptive labels for interactive elements
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Focus Management**: Maintain logical focus order
5. **Color Contrast**: Meet minimum contrast ratios
6. **Screen Reader Support**: Provide meaningful text alternatives

### Component-Specific Accessibility

**Buttons**:
- Use semantic `<button>` elements
- Provide descriptive button text
- Include loading and disabled states
- Ensure keyboard accessibility

**Forms**:
- Associate labels with form controls
- Provide error messages with proper ARIA attributes
- Use appropriate input types
- Include required field indicators

**Cards**:
- Use semantic structure (article, section)
- Provide descriptive headings
- Ensure keyboard navigation for interactive cards
- Include proper focus indicators

## Performance Guidelines

### Component Optimization

1. **Lazy Loading**: Use React.lazy for route-based code splitting
2. **Memoization**: Use React.memo for expensive components
3. **Bundle Size**: Keep components lightweight
4. **Rendering**: Minimize unnecessary re-renders
5. **Images**: Use Next.js Image component for optimization

### Best Practices

- Use design tokens for consistent styling
- Implement proper loading states
- Handle error states gracefully
- Optimize for mobile performance
- Use appropriate caching strategies

## Testing Guidelines

### Component Testing Requirements

Each component should have:

1. **Unit Tests**: Test individual component behavior
2. **Integration Tests**: Test component interactions
3. **Accessibility Tests**: Verify WCAG compliance
4. **Performance Tests**: Ensure performance thresholds
5. **Visual Tests**: Verify design consistency

### Testing Examples

```tsx
// Unit test example
test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});

// Accessibility test example
test('Button meets accessibility standards', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Migration Guide

### Updating Existing Components

When updating components to use the design system:

1. **Replace custom styling** with design tokens
2. **Update component props** to match new API
3. **Add accessibility features** (ARIA labels, keyboard support)
4. **Implement loading and error states**
5. **Update tests** to match new behavior

### Breaking Changes

When introducing breaking changes:

1. **Document changes** in release notes
2. **Provide migration examples**
3. **Maintain backward compatibility** when possible
4. **Update all usage examples**
5. **Notify team members** of changes

## Conclusion

This component library provides a comprehensive set of reusable, accessible, and performant components that follow our sophisticated minimalist aesthetic. By using these components consistently, we ensure a cohesive user experience across the Macabre Film platform.

For questions or contributions, refer to the design system documentation and testing guidelines.
