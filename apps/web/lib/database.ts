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

  // Create a new work
  async createWork(data: { 
    title: string; 
    body: string; 
    classification: string; 
    tags: string[]; 
    creatorId: string; 
  }) {
    if (!data.creatorId?.trim()) {
      throw new Error('Creator ID is required');
    }

    if (!data.title?.trim()) {
      throw new Error('Title is required');
    }

    if (!data.body?.trim()) {
      throw new Error('Body is required');
    }

    if (data.body.length > 1000) {
      throw new Error('Body must be 1000 characters or less');
    }

    if (!data.classification?.trim()) {
      throw new Error('Classification is required');
    }

    const validClassifications = ['Synopsis', 'Scene Description', 'Other'];
    if (!validClassifications.includes(data.classification)) {
      throw new Error('Classification must be Synopsis, Scene Description, or Other');
    }

    // Validate and sanitize tags
    const sanitizedTags = Array.isArray(data.tags) 
      ? data.tags.filter(tag => typeof tag === 'string' && tag.trim()).map(tag => tag.trim())
      : [];

    try {
      return await prisma.work.create({
        data: {
          title: data.title.trim(),
          body: data.body.trim(),
          classification: data.classification.trim(),
          tags: sanitizedTags,
          creatorId: data.creatorId,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2003') {
        throw new Error('Creator not found');
      }
      throw error;
    }
  },

  // Get works by creator
  async getWorksByCreator(creatorId: string) {
    if (!creatorId?.trim()) {
      return [];
    }

    return await prisma.work.findMany({
      where: { creatorId },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  // Get work by ID
  async getWorkById(id: string) {
    if (!id?.trim()) {
      return null;
    }

    return await prisma.work.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },
};
