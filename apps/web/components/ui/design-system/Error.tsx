'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Error alert variant definitions
const errorAlertVariants = cva(
  // Base styles
  [
    'rounded-md p-4',
    'border',
    'flex items-start',
  ],
  {
    variants: {
      variant: {
        error: [
          'bg-red-50',
          'border-red-200',
          'text-red-800',
        ],
        warning: [
          'bg-yellow-50',
          'border-yellow-200',
          'text-yellow-800',
        ],
        info: [
          'bg-blue-50',
          'border-blue-200',
          'text-blue-800',
        ],
      },
    },
    defaultVariants: {
      variant: 'error',
    },
  }
);

// Error alert props interface
interface ErrorAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorAlertVariants> {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  'aria-describedby'?: string;
}

// Error alert component
const ErrorAlert = React.forwardRef<HTMLDivElement, ErrorAlertProps>(
  (
    {
      className,
      variant,
      title,
      message,
      onRetry,
      retryText = 'Try again',
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    // Error icon component
    const ErrorIcon = () => (
      <svg
        className="h-5 w-5 flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>
    );

    // Warning icon component
    const WarningIcon = () => (
      <svg
        className="h-5 w-5 flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    );

    // Info icon component
    const InfoIcon = () => (
      <svg
        className="h-5 w-5 flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h1.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clipRule="evenodd"
        />
      </svg>
    );

    // Get appropriate icon based on variant
    const getIcon = () => {
      switch (variant) {
        case 'warning':
          return <WarningIcon />;
        case 'info':
          return <InfoIcon />;
        default:
          return <ErrorIcon />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(errorAlertVariants({ variant }), className)}
        role="alert"
        aria-live="polite"
        aria-describedby={ariaDescribedby}
        {...props}
      >
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
            >
              {retryText}
            </button>
          )}
        </div>
      </div>
    );
  }
);

ErrorAlert.displayName = 'ErrorAlert';

// Error page component
interface ErrorPageProps {
  title?: string;
  message?: string;
  error?: Error;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

const ErrorPage = React.forwardRef<HTMLDivElement, ErrorPageProps>(
  (
    {
      title = 'Something went wrong',
      message = 'An unexpected error occurred. Please try again.',
      error,
      onRetry,
      retryText = 'Try again',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center min-h-[400px] px-4 text-center',
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="max-w-md">
          <div className="mb-6">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            {message}
          </p>
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="text-sm font-medium text-gray-700 cursor-pointer mb-2">
                Error Details
              </summary>
              <pre className="text-xs text-gray-500 bg-gray-50 p-3 rounded border overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              {retryText}
            </button>
          )}
        </div>
      </div>
    );
  }
);

ErrorPage.displayName = 'ErrorPage';

// Error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <ErrorPage
          title="Something went wrong"
          message="An unexpected error occurred. Please try refreshing the page."
          error={this.state.error}
          onRetry={this.resetError}
          retryText="Try again"
        />
      );
    }

    return this.props.children;
  }
}

// Export components
export {
  ErrorAlert,
  ErrorPage,
  ErrorBoundary,
  errorAlertVariants,
};
export type {
  ErrorAlertProps,
  ErrorPageProps,
  ErrorBoundaryProps,
  ErrorBoundaryState,
};
