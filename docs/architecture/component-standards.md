# Component Standards

## Component Template

All new React components should follow this basic structure, designed as a Server Component by default. For components requiring user interaction, add the "use client"; directive.

Example: components/ui/Button.tsx

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button = ({ children, variant = 'primary', ...props }: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-800',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

export { Button };
```

## Naming Conventions

Component Files: PascalCase (e.g., WorkCard.tsx)

Hooks: camelCase, starting with use (e.g., useUser.ts)

Store Files: camelCase, ending with Store (e.g., userSessionStore.ts)

