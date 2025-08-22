'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/services/authService';
import { Button } from '../ui/design-system';

interface LogoutButtonProps {
  className?: string;
  variant?: 'button' | 'link';
  children?: React.ReactNode;
}

export default function LogoutButton({ 
  className = '', 
  variant = 'button',
  children = 'Logout'
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const result = await authService.logout();
      
      if (result.success) {
        // Redirect to login page
        router.push('/login');
      } else {
        console.error('Logout failed:', result.error);
        // Even if logout API fails, clear local state and redirect
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state and redirect anyway
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const buttonVariant = variant === 'link' ? 'ghost' : 'secondary';
  const buttonSize = variant === 'link' ? 'sm' : 'md';

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoggingOut}
      loading={isLoggingOut}
      variant={buttonVariant}
      size={buttonSize}
      className={className}
    >
      {children}
    </Button>
  );
}
