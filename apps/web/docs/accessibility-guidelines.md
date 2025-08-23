# Accessibility Guidelines and Checklist

## Overview

This document outlines the accessibility requirements and guidelines for the Macabre Film platform. All components and pages must meet **WCAG 2.1 AA standards** to ensure an inclusive user experience for all users, including those with disabilities.

## WCAG 2.1 AA Compliance

### What is WCAG 2.1 AA?

The Web Content Accessibility Guidelines (WCAG) 2.1 AA is the international standard for web accessibility. Our platform must meet these standards to ensure:

- **Perceivable**: Information and UI components are presentable to users in ways they can perceive
- **Operable**: UI components and navigation are operable
- **Understandable**: Information and operation of UI are understandable
- **Robust**: Content can be interpreted by a wide variety of user agents, including assistive technologies

## Accessibility Testing Tools

### Automated Testing
- **jest-axe**: Automated accessibility testing in Jest
- **axe-core**: Browser-based accessibility testing
- **Lighthouse**: Performance and accessibility auditing

### Manual Testing
- **Screen Readers**: NVDA (Windows), VoiceOver (macOS), JAWS
- **Keyboard Navigation**: Tab, arrow keys, Enter, Space
- **Color Contrast**: WebAIM Contrast Checker
- **Focus Indicators**: Visual focus management

## Accessibility Checklist

### 1. Perceivable

#### 1.1 Text Alternatives
- [ ] **Images have alt text**
  ```tsx
  // Good
  <img src="work-image.jpg" alt="Film still from 'The Dark Hour' showing a shadowy figure" />
  
  // Bad
  <img src="work-image.jpg" alt="image" />
  <img src="work-image.jpg" />
  ```

- [ ] **Decorative images are marked as decorative**
  ```tsx
  // Good
  <img src="decorative-border.png" alt="" role="presentation" />
  ```

- [ ] **Complex images have detailed descriptions**
  ```tsx
  // Good
  <img src="chart.png" alt="Bar chart showing film submissions by month: January 15, February 23, March 18" />
  ```

#### 1.2 Time-based Media
- [ ] **Videos have captions**
- [ ] **Audio content has transcripts**
- [ ] **Media players are keyboard accessible**

#### 1.3 Adaptable
- [ ] **Content can be presented without losing structure**
- [ ] **Information is not conveyed by color alone**
- [ ] **Text can be resized up to 200% without loss of functionality**

#### 1.4 Distinguishable
- [ ] **Color contrast meets AA standards**
  - Normal text: 4.5:1 ratio
  - Large text: 3:1 ratio
  - UI components: 3:1 ratio

  ```css
  /* Good - High contrast */
  .text-primary {
    color: #1a1a1a; /* Dark text on light background */
    background: #ffffff;
  }
  
  /* Bad - Low contrast */
  .text-primary {
    color: #666666; /* Insufficient contrast */
    background: #ffffff;
  }
  ```

- [ ] **Text can be resized without horizontal scrolling**
- [ ] **Images of text are not used (except for logos)**

### 2. Operable

#### 2.1 Keyboard Accessible
- [ ] **All functionality is available from keyboard**
  ```tsx
  // Good - Keyboard accessible
  <button onClick={handleClick} onKeyDown={handleKeyDown}>
    Submit
  </button>
  
  // Bad - Mouse only
  <div onClick={handleClick} style={{ cursor: 'pointer' }}>
    Submit
  </div>
  ```

- [ ] **No keyboard traps**
- [ ] **Custom controls have keyboard support**

#### 2.2 Enough Time
- [ ] **Users can adjust or extend time limits**
- [ ] **Auto-updating content can be paused, stopped, or hidden**
- [ ] **No time limits for critical functions**

#### 2.3 Seizures and Physical Reactions
- [ ] **No content flashes more than 3 times per second**
- [ ] **No single flashes or red flashes**

#### 2.4 Navigable
- [ ] **Clear navigation structure**
  ```tsx
  // Good - Semantic navigation
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/works">Works</a></li>
      <li><a href="/submit">Submit</a></li>
    </ul>
  </nav>
  ```

- [ ] **Multiple ways to find content**
- [ ] **Clear page titles and headings**
- [ ] **Focus order is logical and intuitive**

#### 2.5 Input Modalities
- [ ] **Touch targets are at least 44x44px**
- [ ] **Gesture alternatives are available**
- [ ] **Pointer cancellation is supported**

### 3. Understandable

#### 3.1 Readable
- [ ] **Language of page is specified**
  ```html
  <html lang="en">
  ```

- [ ] **Language changes are marked**
  ```html
  <span lang="es">Hola mundo</span>
  ```

- [ ] **Unusual words are explained**
- [ ] **Abbreviations are expanded**

#### 3.2 Predictable
- [ ] **Navigation is consistent**
- [ ] **Components behave predictably**
- [ ] **No automatic context changes**

#### 3.3 Input Assistance
- [ ] **Error identification**
  ```tsx
  // Good - Clear error message
  <div role="alert" aria-live="polite">
    <p>Please enter a valid email address</p>
  </div>
  ```

- [ ] **Labels and instructions**
  ```tsx
  // Good - Clear label and instructions
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    aria-describedby="email-help"
    required
  />
  <div id="email-help">Enter your email address to receive updates</div>
  ```

- [ ] **Error prevention for critical functions**

### 4. Robust

#### 4.1 Compatible
- [ ] **Valid HTML markup**
- [ ] **ARIA attributes are used correctly**
- [ ] **Status messages are announced to screen readers**

## Component-Specific Guidelines

### Buttons

```tsx
// Good - Accessible button
<button
  onClick={handleClick}
  aria-label="Submit work for review"
  disabled={isSubmitting}
>
  {isSubmitting ? 'Submitting...' : 'Submit Work'}
</button>

// Bad - Inaccessible button
<div onClick={handleClick} style={{ cursor: 'pointer' }}>
  Submit
</div>
```

**Checklist**:
- [ ] Uses semantic `<button>` element
- [ ] Has descriptive text or aria-label
- [ ] Shows loading/disabled states
- [ ] Keyboard accessible
- [ ] Focus indicator visible

### Forms

```tsx
// Good - Accessible form
<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="title">Work Title</label>
    <input
      id="title"
      name="title"
      type="text"
      required
      aria-describedby="title-error"
      aria-invalid={!!titleError}
    />
    {titleError && (
      <div id="title-error" role="alert" aria-live="polite">
        {titleError}
      </div>
    )}
  </div>
  
  <button type="submit">Submit</button>
</form>
```

**Checklist**:
- [ ] All inputs have associated labels
- [ ] Error messages are clearly identified
- [ ] Required fields are marked
- [ ] Form validation is announced
- [ ] Submit button is descriptive

### Navigation

```tsx
// Good - Accessible navigation
<nav aria-label="Main navigation">
  <ul>
    <li>
      <a href="/works" aria-current={currentPage === 'works' ? 'page' : undefined}>
        Works
      </a>
    </li>
    <li>
      <a href="/submit" aria-current={currentPage === 'submit' ? 'page' : undefined}>
        Submit
      </a>
    </li>
  </ul>
</nav>
```

**Checklist**:
- [ ] Uses semantic `<nav>` element
- [ ] Has descriptive aria-label
- [ ] Current page is indicated
- [ ] Logical tab order
- [ ] Skip links available

### Cards

```tsx
// Good - Accessible card
<article>
  <header>
    <h3 id="work-title">The Dark Hour</h3>
  </header>
  <p>Description of the work...</p>
  <footer>
    <button
      aria-describedby="work-title"
      onClick={handleViewDetails}
    >
      View Details
    </button>
  </footer>
</article>
```

**Checklist**:
- [ ] Uses semantic structure (article, section)
- [ ] Has descriptive headings
- [ ] Interactive elements are keyboard accessible
- [ ] Focus management for interactive cards
- [ ] Proper ARIA relationships

### Images

```tsx
// Good - Accessible images
<img
  src="work-poster.jpg"
  alt="Film poster for 'The Dark Hour' showing a shadowy figure in a dimly lit corridor"
  width="300"
  height="450"
/>

// Decorative image
<img
  src="decorative-border.png"
  alt=""
  role="presentation"
  aria-hidden="true"
/>
```

**Checklist**:
- [ ] All images have alt text
- [ ] Decorative images are marked appropriately
- [ ] Complex images have detailed descriptions
- [ ] Images are not used for text
- [ ] Alt text is descriptive and meaningful

## Testing Procedures

### Automated Testing

```tsx
// Jest test with jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Component meets accessibility standards', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist

#### Screen Reader Testing
- [ ] **NVDA (Windows)**
  - Install NVDA
  - Navigate through the page
  - Verify all content is announced
  - Test form interactions
  - Check error messages

- [ ] **VoiceOver (macOS)**
  - Enable VoiceOver
  - Navigate with VO + arrow keys
  - Test all interactive elements
  - Verify focus indicators

- [ ] **JAWS (Windows)**
  - Install JAWS
  - Navigate through the page
  - Test all functionality
  - Verify announcements

#### Keyboard Navigation Testing
- [ ] **Tab Navigation**
  - Tab through all interactive elements
  - Verify logical tab order
  - Check focus indicators
  - Test Enter and Space keys

- [ ] **Arrow Key Navigation**
  - Test arrow key navigation in lists
  - Verify dropdown menus work
  - Check carousel/slider navigation

- [ ] **Escape Key**
  - Test modal dismissal
  - Verify dropdown closing
  - Check menu closing

#### Color and Contrast Testing
- [ ] **Color Contrast**
  - Use WebAIM Contrast Checker
  - Test all text combinations
  - Verify 4.5:1 ratio for normal text
  - Verify 3:1 ratio for large text

- [ ] **Color Independence**
  - Test in grayscale
  - Verify information not conveyed by color alone
  - Check error states have text labels

#### Responsive Testing
- [ ] **Text Resizing**
  - Zoom to 200%
  - Verify no horizontal scrolling
  - Check all functionality works
  - Test on different screen sizes

- [ ] **Touch Targets**
  - Verify 44x44px minimum size
  - Test on mobile devices
  - Check spacing between targets

## Common Accessibility Issues

### 1. Missing Alt Text
```tsx
// Issue
<img src="image.jpg" />

// Solution
<img src="image.jpg" alt="Descriptive text" />
```

### 2. Poor Color Contrast
```css
/* Issue */
.text {
  color: #666666;
  background: #ffffff;
}

/* Solution */
.text {
  color: #1a1a1a;
  background: #ffffff;
}
```

### 3. Missing Labels
```tsx
// Issue
<input type="text" />

// Solution
<label htmlFor="input-id">Label</label>
<input id="input-id" type="text" />
```

### 4. Non-Semantic Elements
```tsx
// Issue
<div onClick={handleClick}>Button</div>

// Solution
<button onClick={handleClick}>Button</button>
```

### 5. Missing Focus Indicators
```css
/* Issue */
button:focus {
  outline: none;
}

/* Solution */
button:focus {
  outline: 2px solid #007acc;
  outline-offset: 2px;
}
```

## Accessibility Resources

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WAVE](https://wave.webaim.org/)

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)

### Testing
- [Screen Reader Testing Guide](https://www.nvaccess.org/about-nvda/)
- [VoiceOver Guide](https://support.apple.com/guide/voiceover/welcome/macos)
- [JAWS Documentation](https://www.freedomscientific.com/products/software/jaws/)

## Implementation Checklist

### Development Phase
- [ ] Run automated accessibility tests
- [ ] Test with keyboard navigation
- [ ] Verify color contrast ratios
- [ ] Check semantic HTML structure
- [ ] Test with screen readers

### Code Review
- [ ] Review accessibility implementation
- [ ] Verify ARIA attributes
- [ ] Check focus management
- [ ] Test error handling
- [ ] Validate HTML markup

### Testing Phase
- [ ] Conduct manual accessibility testing
- [ ] Test with assistive technologies
- [ ] Verify responsive behavior
- [ ] Check performance impact
- [ ] Validate against WCAG 2.1 AA

## Conclusion

Accessibility is not a feature—it's a fundamental requirement. By following these guidelines and using the provided checklist, we ensure that the Macabre Film platform is accessible to all users, regardless of their abilities or assistive technologies.

Remember: **Good accessibility is good UX for everyone.**
