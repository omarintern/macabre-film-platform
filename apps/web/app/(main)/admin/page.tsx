import { requireAdmin } from '../../../lib/auth/server';
import UserPromotionForm from '../../../components/features/admin/UserPromotionForm';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default async function AdminPage() {
  // Server-side authentication check - will redirect if not admin
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage user roles and permissions
          </p>
        </div>

        {/* Admin Info */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-sm text-gray-900">{user.role}</p>
            </div>
          </div>
        </div>

        {/* User Promotion Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <UserPromotionForm />
        </div>

        {/* Admin Actions */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900">User Management</h3>
              <p className="text-xs text-gray-500 mt-1">Promote users to Creator or Admin roles</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg opacity-50">
              <h3 className="text-sm font-medium text-gray-500">Content Moderation</h3>
              <p className="text-xs text-gray-400 mt-1">Coming in future updates</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg opacity-50">
              <h3 className="text-sm font-medium text-gray-500">System Analytics</h3>
              <p className="text-xs text-gray-400 mt-1">Coming in future updates</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-blue-900 mb-2">How to Use</h2>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Enter a user&apos;s email address or ID to search for them</li>
            <li>• Select the target role (Creator or Admin)</li>
            <li>• Click &quot;Promote&quot; to update their role</li>
            <li>• Only users with CLIENT role can be promoted to CREATOR</li>
            <li>• Only users with CREATOR role can be promoted to ADMIN</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
