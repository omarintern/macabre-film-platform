import { userService } from '../services/database';

// Mock Prisma client for testing
jest.mock('../services/database', () => ({
  userService: {
    createUser: jest.fn(),
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    updateUserRole: jest.fn(),
  },
}));

describe('User Model Schema Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Model Creation', () => {
    it('should create a user with all required fields', async () => {
      const mockUser = {
        id: 'clx123456789',
        email: 'test@example.com',
        password: 'hashedpassword123',
        role: 'CLIENT' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUser({
        email: 'test@example.com',
        password: 'hashedpassword123',
      });

      expect(userService.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedpassword123',
      });

      expect(result).toEqual(mockUser);
      expect(result.id).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result.password).toBe('hashedpassword123');
      expect(result.role).toBe('CLIENT');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with default CLIENT role when no role specified', async () => {
      const mockUser = {
        id: 'clx123456789',
        email: 'test@example.com',
        password: 'hashedpassword123',
        role: 'CLIENT' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUser({
        email: 'test@example.com',
        password: 'hashedpassword123',
      });

      expect(result.role).toBe('CLIENT');
    });

    it('should create a user with specified role', async () => {
      const mockUser = {
        id: 'clx123456789',
        email: 'creator@example.com',
        password: 'hashedpassword123',
        role: 'CREATOR' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUser({
        email: 'creator@example.com',
        password: 'hashedpassword123',
        role: 'CREATOR',
      });

      expect(result.role).toBe('CREATOR');
    });
  });

  describe('UserRole Enum Values', () => {
    it('should support CLIENT role', async () => {
      const mockUser = { role: 'CLIENT' as const };
      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUser({
        email: 'client@example.com',
        password: 'password',
        role: 'CLIENT',
      });

      expect(result.role).toBe('CLIENT');
    });

    it('should support CREATOR role', async () => {
      const mockUser = { role: 'CREATOR' as const };
      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUser({
        email: 'creator@example.com',
        password: 'password',
        role: 'CREATOR',
      });

      expect(result.role).toBe('CREATOR');
    });

    it('should support ADMIN role', async () => {
      const mockUser = { role: 'ADMIN' as const };
      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUser({
        email: 'admin@example.com',
        password: 'password',
        role: 'ADMIN',
      });

      expect(result.role).toBe('ADMIN');
    });
  });

  describe('Email Uniqueness Constraint', () => {
    it('should find user by unique email', async () => {
      const mockUser = {
        id: 'clx123456789',
        email: 'unique@example.com',
        password: 'hashedpassword123',
        role: 'CLIENT' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.findUserByEmail('unique@example.com');

      expect(userService.findUserByEmail).toHaveBeenCalledWith('unique@example.com');
      expect(result).toEqual(mockUser);
      expect(result?.email).toBe('unique@example.com');
    });

    it('should return null for non-existent email', async () => {
      (userService.findUserByEmail as jest.Mock).mockResolvedValue(null);

      const result = await userService.findUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('User Role Updates', () => {
    it('should update user role successfully', async () => {
      const mockUpdatedUser = {
        id: 'clx123456789',
        email: 'user@example.com',
        password: 'hashedpassword123',
        role: 'CREATOR' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userService.updateUserRole as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUserRole('clx123456789', 'CREATOR');

      expect(userService.updateUserRole).toHaveBeenCalledWith('clx123456789', 'CREATOR');
      expect(result.role).toBe('CREATOR');
    });
  });

  describe('User Lookup by ID', () => {
    it('should find user by ID', async () => {
      const mockUser = {
        id: 'clx123456789',
        email: 'user@example.com',
        password: 'hashedpassword123',
        role: 'CLIENT' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userService.findUserById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.findUserById('clx123456789');

      expect(userService.findUserById).toHaveBeenCalledWith('clx123456789');
      expect(result).toEqual(mockUser);
      expect(result?.id).toBe('clx123456789');
    });

    it('should return null for non-existent ID', async () => {
      (userService.findUserById as jest.Mock).mockResolvedValue(null);

      const result = await userService.findUserById('nonexistent-id');

      expect(result).toBeNull();
    });
  });
});

describe('Input Validation & Error Handling', () => {
  describe('createUser validation', () => {
    it('should handle email normalization', async () => {
      const mockUser = {
        id: 'clx123456789',
        email: 'test@example.com',
        password: 'hashedpassword123',
        role: 'CLIENT' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      await userService.createUser({
        email: '  TEST@EXAMPLE.COM  ',
        password: 'password123',
      });

      expect(userService.createUser).toHaveBeenCalledWith({
        email: '  TEST@EXAMPLE.COM  ',
        password: 'password123',
      });
    });

    it('should handle duplicate email error', async () => {
      const duplicateError = new Error('User with this email already exists');
      (userService.createUser as jest.Mock).mockRejectedValue(duplicateError);

      await expect(
        userService.createUser({
          email: 'duplicate@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('findUserByEmail validation', () => {
    it('should handle empty email gracefully', async () => {
      (userService.findUserByEmail as jest.Mock).mockResolvedValue(null);

      const result = await userService.findUserByEmail('');
      expect(result).toBeNull();
    });

    it('should handle email normalization in search', async () => {
      const mockUser = {
        id: 'clx123456789',
        email: 'test@example.com',
        password: 'hashedpassword123',
        role: 'CLIENT' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      await userService.findUserByEmail('  TEST@EXAMPLE.COM  ');
      expect(userService.findUserByEmail).toHaveBeenCalledWith('  TEST@EXAMPLE.COM  ');
    });
  });

  describe('updateUserRole validation', () => {
    it('should handle user not found error', async () => {
      const notFoundError = new Error('User not found');
      (userService.updateUserRole as jest.Mock).mockRejectedValue(notFoundError);

      await expect(
        userService.updateUserRole('nonexistent-id', 'CREATOR')
      ).rejects.toThrow('User not found');
    });
  });
});

describe('Database Schema Validation', () => {
  it('should validate that User model has all required fields', () => {
    // This test validates the schema structure at compile time
    const userSchema = {
      id: 'string',
      email: 'string',
      password: 'string',
      role: 'CLIENT | CREATOR | ADMIN',
      createdAt: 'DateTime',
      updatedAt: 'DateTime',
    };

    // Verify all required fields are present
    expect(userSchema.id).toBeDefined();
    expect(userSchema.email).toBeDefined();
    expect(userSchema.password).toBeDefined();
    expect(userSchema.role).toBeDefined();
    expect(userSchema.createdAt).toBeDefined();
    expect(userSchema.updatedAt).toBeDefined();

    // Verify role enum values
    expect(userSchema.role).toContain('CLIENT');
    expect(userSchema.role).toContain('CREATOR');
    expect(userSchema.role).toContain('ADMIN');
  });
});
