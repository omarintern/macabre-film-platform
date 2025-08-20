'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/services/authService';

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

  const baseStyles = 'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';
  
  if (variant === 'link') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`${baseStyles} text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoggingOut ? 'Logging out...' : children}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${baseStyles} px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoggingOut ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
          Logging out...
        </>
      ) : (
        children
      )}
    </button>
  );
}
