# State Management

All shared application state will be managed through Zustand stores located in the /stores directory.

Example: stores/userSessionStore.ts

```typescript
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'CREATOR' | 'ADMIN';
}

interface UserSessionState {
  user: User | null;
  token: string | null;
  setUserSession: (user: User, token: string) => void;
  clearUserSession: () => void;
}

export const useUserSessionStore = create<UserSessionState>((set) => ({
  user: null,
  token: null,
  setUserSession: (user, token) => set({ user, token }),
  clearUserSession: () => set({ user: null, token: null }),
}));
```
