'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Card variant definitions
const cardVariants = cva(
  // Base styles
  [
    'rounded-lg border bg-white',
    'transition-all duration-200',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-200',
          'shadow-sm',
        ],
        elevated: [
          'border-transparent',
          'shadow-lg',
        ],
        outline: [
          'border-gray-300',
          'shadow-none',
        ],
      },
      padding: {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

// Card props interface
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

// Card component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

// Card header props type
type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

// Card header component
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 pb-4', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card title props type
type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

// Card title component
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-lg font-semibold leading-none tracking-tight text-gray-900',
          className
        )}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

// Card description props type
type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

// Card description component
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-gray-600', className)}
        {...props}
      />
    );
  }
);

CardDescription.displayName = 'CardDescription';

// Card content props type
type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

// Card content component
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('pt-0', className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

// Card footer props type
type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

// Card footer component
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center pt-4', className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

// Export components
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
export type {
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
};
