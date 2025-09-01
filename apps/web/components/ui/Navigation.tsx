'use client';

import Link from 'next/link';
import { useAuth } from '../../stores/userSessionStore';
import LogoutButton from './LogoutButton';
import { Button, Skeleton } from '../ui/design-system';

export default function Navigation() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
                Macabre
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-12">
            <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight hover:text-gray-700 transition-colors">
              Macabre
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/spaces" 
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm tracking-wide"
              >
                Spaces
              </Link>
              <Link 
                href="/index" 
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm tracking-wide"
              >
                Index
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated && user ? (
              <>
                <div className="hidden md:flex items-center space-x-6">
                  {user.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                    >
                      Admin
                    </Link>
                  )}
                  {user.role === 'CREATOR' && (
                    <>
                      <Link 
                        href={`/profile/${user.id}`}
                        className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                      >
                        Profile
                      </Link>
                      <Link 
                        href="/profile/edit" 
                        className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                      >
                        Settings
                      </Link>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex items-center space-x-3">
                    <span className="text-sm text-gray-700 font-medium">
                      {user.name || user.email}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium tracking-wide">
                      {user.role}
                    </span>
                  </div>
                  
                  {user.role === 'CREATOR' && (
                    <Button asChild variant="primary" size="sm" className="hidden sm:inline-flex">
                      <Link href="/submit">
                        Submit Work
                      </Link>
                    </Button>
                  )}
                  
                  <LogoutButton variant="link" />
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
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
