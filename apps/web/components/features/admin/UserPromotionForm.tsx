'use client';

import { useState } from 'react';
import { adminService } from '../../../lib/services/adminService';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserPromotionFormProps {
  onSuccess?: (user: User) => void;
}

export default function UserPromotionForm({ onSuccess }: UserPromotionFormProps) {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [targetRole, setTargetRole] = useState<'CREATOR' | 'ADMIN'>('CREATOR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchedUser, setSearchedUser] = useState<User | null>(null);

  const handleSearch = async () => {
    if (!userIdentifier.trim()) {
      setMessage({ type: 'error', text: 'Please enter a user email or ID' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await adminService.searchUser(userIdentifier.trim());
      
      if (result.success && result.user) {
        setSearchedUser(result.user);
        setMessage({ type: 'success', text: `Found user: ${result.user.email} (${result.user.role})` });
      } else {
        setSearchedUser(null);
        setMessage({ type: 'error', text: result.error || 'User not found' });
      }
    } catch {
      setSearchedUser(null);
      setMessage({ type: 'error', text: 'Failed to search user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userIdentifier.trim()) {
      setMessage({ type: 'error', text: 'Please enter a user email or ID' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await adminService.promoteUser(userIdentifier.trim(), targetRole);
      
      if (result.success && result.user) {
        setMessage({ type: 'success', text: result.message || `User promoted to ${targetRole}` });
        setSearchedUser(result.user);
        setUserIdentifier('');
        onSuccess?.(result.user);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to promote user' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to promote user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Promote User</h2>
      
      <form onSubmit={handlePromote} className="space-y-4">
        <div>
          <label htmlFor="userIdentifier" className="block text-sm font-medium text-gray-700">
            User Email or ID
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="userIdentifier"
              value={userIdentifier}
              onChange={(e) => setUserIdentifier(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              placeholder="Enter email or user ID"
              aria-describedby="userIdentifier-help"
              minLength={3}
              maxLength={255}
              required
            />
            <div id="userIdentifier-help" className="sr-only">
              Enter the email address or unique ID of the user you want to promote
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSubmitting}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        {searchedUser && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">Found User:</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Email:</strong> {searchedUser.email}</p>
              <p><strong>Current Role:</strong> {searchedUser.role}</p>
              <p><strong>ID:</strong> {searchedUser.id}</p>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700">
            Target Role
          </label>
          <select
            id="targetRole"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value as 'CREATOR' | 'ADMIN')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          >
            <option value="CREATOR">Creator</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {message && (
          <div className={`p-3 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Processing...' : `Promote to ${targetRole}`}
        </button>
      </form>
    </div>
  );
}
