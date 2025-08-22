'use client';

import Link from 'next/link';
import { useAuth } from '../../stores/userSessionStore';
import LogoutButton from './LogoutButton';
import { Button, Skeleton } from '../ui/design-system';

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
              <Skeleton className="h-8 w-16" />
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
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Macabre
            </Link>
            <Link 
              href="/spaces" 
              className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Spaces
            </Link>
            <Link 
              href="/index" 
              className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Index
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
                {user.role === 'CREATOR' && (
                  <>
                    <Button asChild variant="primary" size="sm">
                      <Link href="/submit">
                        Submit New Work
                      </Link>
                    </Button>
                    <Link 
                      href={`/profile/${user.id}`}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/profile/edit" 
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Edit Profile
                    </Link>
                  </>
                )}
                <span className="text-sm text-gray-600">
                  Welcome, {user.name || user.email}
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
                <Button asChild variant="primary" size="sm">
                  <Link href="/signup">
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
