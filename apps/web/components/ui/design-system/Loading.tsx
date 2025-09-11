'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

// Loading spinner variant definitions
const spinnerVariants = cva(
  // Base styles
  [
    'animate-spin',
    'border-2 border-gray-200',
    'border-t-blue-600',
    'rounded-full',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Loading spinner props interface
interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  'aria-label'?: string;
}

// Loading spinner component
const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, 'aria-label': ariaLabel = 'Loading...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size }), className)}
        role="status"
        aria-label={ariaLabel}
        {...props}
      >
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

// Loading skeleton variant definitions
const skeletonVariants = cva(
  // Base styles
  [
    'animate-pulse',
    'bg-gray-200',
    'rounded',
  ],
  {
    variants: {
      variant: {
        text: 'h-4',
        title: 'h-6',
        avatar: 'h-10 w-10 rounded-full',
        button: 'h-10 w-20',
        card: 'h-32',
      },
    },
    defaultVariants: {
      variant: 'text',
    },
  }
);

// Loading skeleton props interface
interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

// Loading skeleton component
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Loading page component
interface LoadingPageProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const LoadingPage = React.forwardRef<HTMLDivElement, LoadingPageProps>(
  ({ message = 'Loading...', size = 'lg', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center min-h-[200px] space-y-4',
          className
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        <Spinner size={size} aria-label={message} />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    );
  }
);

LoadingPage.displayName = 'LoadingPage';

// Loading overlay component
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ isVisible, message = 'Loading...', size = 'md', className, children, ...props }, ref) => {
    if (!isVisible) {
      return <>{children}</>;
    }

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        {children}
        <div
          className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center space-y-2">
            <Spinner size={size} aria-label={message} />
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';

// Loading button component
interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, children, loadingText = 'Loading...', size = 'sm', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md',
          'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors',
          className
        )}
        disabled={loading}
        {...props}
      >
        {loading && (
          <>
            <Spinner size={size} className="mr-2" aria-label={loadingText} />
            <span className="sr-only">{loadingText}</span>
          </>
        )}
        {children}
      </button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

// Export components
export {
  Spinner,
  Skeleton,
  LoadingPage,
  LoadingOverlay,
  LoadingButton,
  spinnerVariants,
  skeletonVariants,
};
export type {
  SpinnerProps,
  SkeletonProps,
  LoadingPageProps,
  LoadingOverlayProps,
  LoadingButtonProps,
};
