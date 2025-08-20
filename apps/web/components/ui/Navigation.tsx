'use client';

import Link from 'next/link';
import { useAuth } from '../../stores/userSessionStore';
import LogoutButton from './LogoutButton';

export default function Navigation() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Macabre
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Macabre
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {user.role}
                </span>
                <LogoutButton variant="link" />
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
