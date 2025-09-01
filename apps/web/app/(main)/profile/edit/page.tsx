import { requireAuth } from '../../../../lib/auth/server';
import { userService } from '../../../../lib/database';
import ProfileEditClient from './ProfileEditClient';

export default async function ProfileEditPage() {
  // Server-side authentication check - will redirect if not authenticated
  const user = await requireAuth();
  
  // Get full user profile from database
  const userProfile = await userService.findUserById(user.userId);
  
  if (!userProfile) {
    throw new Error('User profile not found');
  }
  
  return (
    <ProfileEditClient 
      user={{
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name || '',
        bio: userProfile.bio || '',
        role: userProfile.role
      }}
    />
  );
}
