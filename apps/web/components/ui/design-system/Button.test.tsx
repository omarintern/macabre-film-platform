import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, ButtonGroup } from './Button';
import { testAccessibility } from '@/lib/testing/accessibility';

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders button with text content', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders button with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-white', 'border-gray-300');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
    });

    it('renders danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600');
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('renders medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });

    it('renders extra large size', () => {
      render(<Button size="xl">Extra Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
    });
  });

  describe('Full Width', () => {
    it('renders full width button', () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('renders normal width by default', () => {
      render(<Button>Normal Width</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-label', 'Loading...');
    });

    it('disables button when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('hides text content when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      const textSpan = button.querySelector('span');
      expect(textSpan).toHaveClass('opacity-0');
    });
  });

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="icon">🚀</span>;

    it('renders left icon', () => {
      render(<Button leftIcon={<TestIcon />}>With Icon</Button>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders right icon', () => {
      render(<Button rightIcon={<TestIcon />}>With Icon</Button>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('does not render icons when loading', () => {
      render(
        <Button loading leftIcon={<TestIcon />} rightIcon={<TestIcon />}>
          Loading
        </Button>
      );
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies disabled styles', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('Event Handling', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button loading onClick={handleClick}>Loading</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      await testAccessibility(container);
    });

    it('supports aria-describedby', () => {
      render(
        <div>
          <div id="description">Button description</div>
          <Button aria-describedby="description">Button</Button>
        </div>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('has proper focus management', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
    });

    it('supports keyboard navigation', () => {
      render(<Button>Keyboard</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(button).toHaveFocus();
    });
  });
});

describe('ButtonGroup Component', () => {
  describe('Basic Rendering', () => {
    it('renders button group with children', () => {
      render(
        <ButtonGroup>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>
      );
      
      expect(screen.getByRole('button', { name: 'Button 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Button 2' })).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <ButtonGroup className="custom-group">
          <Button>Button</Button>
        </ButtonGroup>
      );
      
      const group = screen.getByRole('group');
      expect(group).toHaveClass('custom-group');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <ButtonGroup ref={ref}>
          <Button>Button</Button>
        </ButtonGroup>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Group Behavior', () => {
    it('applies group role', () => {
      render(
        <ButtonGroup>
          <Button>Button</Button>
        </ButtonGroup>
      );
      
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(
        <ButtonGroup aria-label="Action buttons">
          <Button>Button</Button>
        </ButtonGroup>
      );
      
      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-label', 'Action buttons');
    });

    it('applies proper styling to grouped buttons', () => {
      render(
        <ButtonGroup>
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </ButtonGroup>
      );
      
      const buttons = screen.getAllByRole('button');
      
      // First button should not have rounded-l-none
      expect(buttons[0]).not.toHaveClass('rounded-l-none');
      
      // Middle button should have rounded-l-none and rounded-r-none
      expect(buttons[1]).toHaveClass('rounded-l-none', 'rounded-r-none');
      
      // Last button should not have rounded-r-none
      expect(buttons[2]).not.toHaveClass('rounded-r-none');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <ButtonGroup aria-label="Test group">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>
      );
      
      await testAccessibility(container);
    });

    it('supports keyboard navigation within group', () => {
      render(
        <ButtonGroup>
          <Button>First</Button>
          <Button>Second</Button>
        </ButtonGroup>
      );
      
      const buttons = screen.getAllByRole('button');
      
      // Test that all buttons are focusable
      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();
      
      buttons[1].focus();
      expect(buttons[1]).toHaveFocus();
      
      // Test that buttons can receive focus programmatically
      buttons.forEach((button, index) => {
        button.focus();
        expect(button).toHaveFocus();
      });
    });
  });
});
