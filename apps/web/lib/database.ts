import { PrismaClient, UserRole } from '../src/generated/prisma';

// Extend global type to include prisma
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client instance for the web app
export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_lFB4urDN6fmq@ep-still-star-ab6ivgpn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
      },
    },
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// User model utilities for web app
export const userService = {
  // Create a new user
  async createUser(data: { email: string; password: string; role?: UserRole }) {
    try {
      // Basic input validation
      if (!data.email?.trim()) {
        throw new Error('Email is required');
      }
      if (!data.password?.trim()) {
        throw new Error('Password is required');
      }

      return await prisma.user.create({
        data: {
          email: data.email.toLowerCase().trim(),
          password: data.password,
          role: data.role || UserRole.CLIENT,
        },
      });
    } catch (error) {
      // Handle Prisma unique constraint violations
      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  },

  // Find user by email
  async findUserByEmail(email: string) {
    if (!email?.trim()) {
      return null;
    }
    
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  },

  // Find user by ID
  async findUserById(id: string) {
    if (!id?.trim()) {
      return null;
    }
    
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  // Update user profile
  async updateUserProfile(id: string, data: { name?: string; bio?: string }) {
    if (!id?.trim()) {
      throw new Error('User ID is required');
    }

    // Validate and sanitize input
    const sanitizedData: { name?: string; bio?: string } = {};
    
    if (data.name !== undefined) {
      sanitizedData.name = data.name?.trim() || undefined;
    }
    
    if (data.bio !== undefined) {
      sanitizedData.bio = data.bio?.trim() || undefined;
    }

    try {
      return await prisma.user.update({
        where: { id },
        data: sanitizedData,
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        throw new Error('User not found');
      }
      throw error;
    }
  },

  // Get user profile (public info only)
  async getUserProfile(id: string) {
    if (!id?.trim()) {
      return null;
    }

    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  // Update user role (for admin functionality)
  async updateUserRole(id: string, role: UserRole) {
    if (!id?.trim()) {
      throw new Error('User ID is required');
    }

    try {
      return await prisma.user.update({
        where: { id },
        data: { role },
      });
    } catch (error) {
      // Handle case where user doesn't exist
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        throw new Error('User not found');
      }
      throw error;
    }
  },
};
