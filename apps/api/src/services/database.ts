import { PrismaClient, UserRole } from '../generated/prisma';

// Extend global type to include prisma
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client instance
export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Database connection test function
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log('📦 Database connection closed');
}

// User model utilities with enhanced error handling
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

  // Update user role
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
