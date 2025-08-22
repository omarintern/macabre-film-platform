'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Input variant definitions
const inputVariants = cva(
  // Base styles
  [
    'flex w-full',
    'rounded-md border',
    'bg-white',
    'px-3 py-2',
    'text-sm',
    'placeholder:text-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300',
          'focus:border-blue-500 focus:ring-blue-500',
          'hover:border-gray-400',
        ],
        error: [
          'border-red-300',
          'focus:border-red-500 focus:ring-red-500',
          'hover:border-red-400',
        ],
        success: [
          'border-green-300',
          'focus:border-green-500 focus:ring-green-500',
          'hover:border-green-400',
        ],
      },
      size: {
        sm: ['px-2 py-1', 'text-xs', 'min-h-[28px]'],
        md: ['px-3 py-2', 'text-sm', 'min-h-[36px]'],
        lg: ['px-4 py-3', 'text-base', 'min-h-[44px]'],
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fullWidth: true,
    },
  }
);

// Input props interface
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  'aria-describedby'?: string;
}

// Input component
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      error = false,
      success = false,
      leftIcon,
      rightIcon,
      label,
      helperText,
      errorMessage,
      successMessage,
      id,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine variant based on props
    const inputVariant = error ? 'error' : success ? 'success' : variant;
    
    // Build aria-describedby
    const describedBy = [
      ariaDescribedby,
      helperText && `${inputId}-helper`,
      errorMessage && `${inputId}-error`,
      successMessage && `${inputId}-success`,
    ]
      .filter(Boolean)
      .join(' ');

    // Compose class names
    const inputClasses = cn(
      inputVariants({ variant: inputVariant, size, fullWidth }),
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    );

    // Accessibility attributes
    const accessibilityProps = {
      'aria-invalid': error,
      'aria-describedby': describedBy || undefined,
      'aria-required': props.required,
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400" aria-hidden="true">
                {leftIcon}
              </div>
            </div>
          )}

          {/* Input element */}
          <input
            id={inputId}
            className={inputClasses}
            ref={ref}
            {...accessibilityProps}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400" aria-hidden="true">
                {rightIcon}
              </div>
            </div>
          )}
        </div>

        {/* Helper text */}
        {helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}

        {/* Error message */}
        {error && errorMessage && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {/* Success message */}
        {success && successMessage && (
          <p
            id={`${inputId}-success`}
            className="mt-1 text-sm text-green-600"
          >
            {successMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Export component
export { Input, inputVariants };
export type { InputProps };
