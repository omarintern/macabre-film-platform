'use client';

import React from 'react';
import { cn } from '../../../lib/utils';

// Button props interface (pure Tailwind implementation)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Pure Tailwind class generator function
function getButtonClasses(
  variant: ButtonProps['variant'] = 'primary',
  size: ButtonProps['size'] = 'md',
  fullWidth: ButtonProps['fullWidth'] = false
): string {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 select-none';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 shadow-sm',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm'
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md min-h-[32px]',
    md: 'px-4 py-2 text-sm rounded-md min-h-[40px]',
    lg: 'px-6 py-3 text-base rounded-lg min-h-[48px]',
    xl: 'px-8 py-4 text-lg rounded-lg min-h-[56px]'
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], widthClasses);
}

// Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    // Handle loading state
    const isDisabled = disabled || loading;
    
    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // Compose class names
    const buttonClasses = cn(
      getButtonClasses(variant, size, fullWidth),
      className
    );

    // Accessibility attributes
    const accessibilityProps = {
      'aria-disabled': isDisabled,
      'aria-describedby': ariaDescribedby,
      'aria-busy': loading,
      ...(loading && { 'aria-label': 'Loading...' }),
    };

    // Render button content
    const buttonContent = (
      <>
        {loading && <LoadingSpinner />}
        {!loading && leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className={cn(loading && 'opacity-0')}>
          {children}
        </span>
        {!loading && rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </>
    );

    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={isDisabled}
        {...accessibilityProps}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ButtonGroup component (pure Tailwind implementation)
interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, ...props }, ref) => {
    const groupClasses = cn(
      'inline-flex rounded-md shadow-sm',
      className
    );

    // Clone children and modify their classes for grouped styling
    const childrenArray = React.Children.toArray(children);
    const modifiedChildren = childrenArray.map((child, index) => {
      if (React.isValidElement(child) && child.type === Button) {
        const isFirst = index === 0;
        const isLast = index === childrenArray.length - 1;
        const isMiddle = !isFirst && !isLast;

        // Build additional classes for grouped styling
        let additionalClasses = 'relative';
        
        if (!isFirst) {
          additionalClasses += ' -ml-px';
        }
        
        if (isFirst && !isLast) {
          additionalClasses += ' rounded-r-none';
        } else if (isLast && !isFirst) {
          additionalClasses += ' rounded-l-none';
        } else if (isMiddle) {
          additionalClasses += ' rounded-l-none rounded-r-none';
        }

        // Clone with modified className
        return React.cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
          ...(child.props as React.HTMLAttributes<HTMLElement>),
          className: cn((child.props as React.HTMLAttributes<HTMLElement>)?.className, additionalClasses),
          style: {
            ...((child.props as React.HTMLAttributes<HTMLElement>)?.style || {}),
            zIndex: 'auto', // Base z-index, will be overridden by hover/focus
          },
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
            (e.target as HTMLElement).style.zIndex = '10';
            (child.props as React.HTMLAttributes<HTMLElement>)?.onMouseEnter?.(e);
          },
          onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
            (e.target as HTMLElement).style.zIndex = 'auto';
            (child.props as React.HTMLAttributes<HTMLElement>)?.onMouseLeave?.(e);
          },
          onFocus: (e: React.FocusEvent<HTMLElement>) => {
            (e.target as HTMLElement).style.zIndex = '10';
            (child.props as React.HTMLAttributes<HTMLElement>)?.onFocus?.(e);
          },
          onBlur: (e: React.FocusEvent<HTMLElement>) => {
            (e.target as HTMLElement).style.zIndex = 'auto';
            (child.props as React.HTMLAttributes<HTMLElement>)?.onBlur?.(e);
          },
        });
      }
      return child;
    });

    return (
      <div
        className={groupClasses}
        ref={ref}
        role="group"
        {...props}
      >
        {modifiedChildren}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

// Export components
export { Button, ButtonGroup };
export type { ButtonProps, ButtonGroupProps };
