Excellent. The Frontend Architecture Document is now complete.

Here is the final version, ready to be saved as docs/frontend-architecture.md. It contains all the sections we have defined and approved. This document provides the complete technical blueprint for the development team.

# Frontend Architecture Document (v2.0 - 100% Firebase)

## 1. Introduction & Foundation
This document outlines the complete frontend architecture for the Film Collaboration Platform. It serves as the single source of truth for all frontend development, ensuring consistency, scalability, and adherence to our minimalist design philosophy.

The project is built using Next.js App Router with **100% Firebase backend** - no API routes, no Prisma, no separate backend server.

## 2. Frontend Tech Stack

| Category | Technology | Version | Purpose & Rationale |
|----------|------------|---------|---------------------|
| Framework | Next.js | Latest Stable | Provides a robust foundation with server-side rendering, routing, and optimizations. |
| Language | TypeScript | Latest Stable | Ensures type safety, leading to more maintainable and error-free code. |
| Styling | Tailwind CSS | v4 | A utility-first CSS framework that allows for rapid, consistent styling. |
| State Management | Zustand | Latest Stable | A small, fast, and scalable state-management solution with a minimalist API. |
| **Backend** | **Firebase** | **Latest Stable** | **100% Firebase: Firestore + Auth + Realtime Database** |
| Testing | Jest & RTL | Latest Stable | The industry standard for testing React applications. |
| Linting/Formatting | ESLint & Prettier | Latest Stable | Enforces consistent code style and catches common errors. |

## 3. Project Structure (100% Firebase)

```
/
├── app/                  # Next.js App Router
│   ├── (main)/             # Main application pages route group
│   │   ├── layout.tsx        # Main layout (e.g., with nav header)
│   │   ├── spaces/           # Spaces page (main gallery)
│   │   ├── index/            # Route for the "Index" page
│   │   └── ...
│   ├── (auth)/             # Auth pages route group
│   │   ├── login/
│   │   └── signup/
│   └── globals.css         # Global styles
├── components/           # Reusable React components
│   ├── ui/                 # General, reusable UI (e.g., Button, Card, Input)
│   ├── features/           # Feature-specific components
│   └── shared/             # Complex components shared across pages
├── lib/                  # Utility functions, services, helper scripts
│   └── firebase/           # Firebase configuration and services
│       ├── config.ts         # Firebase initialization
│       ├── dataService.ts    # Firestore operations (replaces Prisma)
│       ├── authService.ts    # Firebase Auth operations
│       └── realtimeService.ts # Firebase Realtime DB operations
├── hooks/                # Custom React hooks
├── stores/               # Zustand state management stores
├── public/               # Static assets (images, fonts)
├── .env.local            # Firebase environment variables (DO NOT COMMIT)
├── middleware.ts         # For protecting routes (Firebase Auth)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

**REMOVED**: 
- ~~`api/` directory~~ (No API routes needed)
- ~~`prisma/` directory~~ (Replaced by Firebase)

## 4. Data Architecture (100% Firebase)

### **Firebase Services:**
- **Firestore**: Main database for users, works, and structured data
- **Firebase Auth**: User authentication and session management  
- **Realtime Database**: Live updates and real-time features

### **Data Flow:**
```
Frontend Component → Firebase Service → Firebase Cloud
```

**No API routes, no Prisma, no separate backend server.**

## 5. Component Standards
Component Template
All new React components should follow this basic structure, designed as a Server Component by default. For components requiring user interaction, add the "use client"; directive.

Example: components/ui/Button.tsx

TypeScript

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
Naming Conventions
Component Files: PascalCase (e.g., WorkCard.tsx)

Hooks: camelCase, starting with use (e.g., useUser.ts)

Store Files: camelCase, ending with Store (e.g., userSessionStore.ts)

## 6. State Management  
All shared application state will be managed through Zustand stores with Firebase Auth integration.

Example: stores/userSessionStore.ts
```typescript
import { create } from 'zustand';
import { firebaseAuthService } from '../lib/firebase/authService';

interface User {
  id: string;
  email: string;
  role: 'CREATOR' | 'ADMIN';
  name: string | null;
}

interface UserSessionState {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useUserSessionStore = create<UserSessionState>((set) => ({
  user: null,
  isAuthenticated: false,
  signIn: async (email, password) => {
    const { user } = await firebaseAuthService.signIn({ email, password });
    set({ user, isAuthenticated: true });
  },
  signUp: async (name, email, password) => {
    const { user } = await firebaseAuthService.signUp({ name, email, password });
    set({ user, isAuthenticated: true });
  },
  signOut: async () => {
    await firebaseAuthService.signOut();
    set({ user: null, isAuthenticated: false });
  }
}));
```

## 7. Data Integration (Firebase-Only)

All backend communication uses Firebase services directly from the frontend:

**Example Service: lib/services/workService.ts**
```typescript
import { firebaseDataService } from '../firebase/dataService';

export const workService = {
  async createWork(workData, creatorId) {
    return await firebaseDataService.createWork(workData, creatorId);
  },
  async getAllWorks(page, limit) {
    return await firebaseDataService.getAllWorks(page, limit);
  }
};
```

**No API routes needed** - all operations happen directly between frontend and Firebase.

## 8. Routing
We use the Next.js App Router's file-based system. Route protection is handled by middleware.ts which checks Firebase Auth state.

**No API routes are used** - all data operations happen via Firebase client SDK.

## 9. Styling Guidelines
Styling will be done primarily with Tailwind's utility classes directly in JSX. The brand palette, fonts, and spacing are configured via Tailwind v4's CSS-based configuration.

## 10. Testing Requirements
We follow a pragmatic testing strategy using Jest and React Testing Library. Tests will be co-located with their respective components and will focus on testing user behavior rather than implementation details.

## 11. Environment Configuration (Firebase Only)

Environment variables for **Firebase configuration only**:

```bash
# Firebase Configuration - Production
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```
## 11.5. Firestore Index Requirements

**CRITICAL**: The following composite indexes must be created in Firebase Console for the application to function properly:

### Required Indexes

1. **Works by Creator Index** (for profile pages)
   - **Collection:** `works`
   - **Fields:** 
     - `creatorId` (Ascending)
     - `createdAt` (Descending)
   - **Purpose:** Enables efficient querying of works by creator with chronological sorting

### Creating Indexes

When you encounter a Firestore index error, Firebase Console will provide a direct link to create the required index. Follow these steps:

1. **Click the provided link** from the error message
2. **Review the index configuration** (usually pre-filled correctly)
3. **Click "Create Index"**
4. **Wait 1-5 minutes** for the index to be built
5. **Refresh the application** once the index shows as "Enabled"

### Index Management

- Indexes are automatically created when needed during development
- Production deployments should have all required indexes pre-created
- Monitor Firebase Console for any new index requirements as features are added


## 12. Frontend Developer Standards

- **State Management**: All shared state must be managed through Zustand stores.
- **Data Operations**: All data operations must use Firebase services directly (no API routes).
- **Authentication**: Use Firebase Auth via userSessionStore.
- **Styling**: Always use Tailwind utility classes directly in JSX.
- **Component Logic**: Keep components focused on presentation; move complex logic to hooks, stores, or utilities.

**CRITICAL**: No Prisma, no API routes, no separate backend server - 100% Firebase client-side architecture.

Now let me update the middleware to block all old API routes:

```typescript:apps/web/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/spaces', // Public access for browsing works
  '/index', // Public access for browsing tags
];

// 🧪 QA FIX: 100% Firebase - No API routes needed
const publicApiRoutes: string[] = [
  // All API routes disabled - using 100% Firebase client-side
];

// Define admin-only routes
const adminOnlyRoutes = [
  '/admin',
];

// 🧪 QA FIX: Block all old Prisma API routes to prevent internal server errors
const blockedApiRoutes = [
  '/api/works',
  '/api/tags', 
  '/api/profile',
  '/api/admin',
  '/api/performance',
  '/api/bootstrap',
  '/api/auth' // Also block old auth routes since we use Firebase Auth directly
];

// Helper function to check if a path is public
function isPublicRoute(pathname: string): boolean {
  // 🧪 QA FIX: Block old API routes that use Prisma
  if (blockedApiRoutes.some(route => pathname.startsWith(route))) {
    return false; // Force block for old API routes
  }
  
  // Check exact matches for public routes
  if (publicRoutes.includes(pathname)) {
    return true;
  }
  
  // Check if it's a public API route (none currently)
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return true;
  }
  
  // Check for static assets and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return true;
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🧪 QA FIX: Block old API routes entirely to prevent Prisma errors
  if (blockedApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.json(
      { 
        error: 'API route disabled',
        message: 'This application uses 100% Firebase client-side architecture. API routes are not needed.',
        architecture: 'Firebase Firestore + Auth + Realtime Database'
      },
      { status: 404 }
    );
  }
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // For protected routes, redirect to login if not authenticated
  // (Firebase Auth state will be checked client-side)
  const loginUrl = new URL('/login', request.url);
  if (pathname !== '/') {
    loginUrl.searchParams.set('redirect', pathname);
  }
  return NextResponse.redirect(loginUrl);
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

## **🎯 WHAT THESE FIXES ACCOMPLISH:**

1. ✅ **Blocks all old API routes** that use Prisma (preventing internal server errors)
2. ✅ **Updates architecture.md** to reflect 100% Firebase (removes Prisma references)
3. ✅ **Ensures clean separation** - no mixing of Firebase and Prisma
4. ✅ **Prevents middleware crashes** by blocking problematic routes entirely

**This should fix the internal server error and make Spaces load properly with 100% Firebase!**