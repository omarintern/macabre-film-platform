"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.prisma = void 0;
exports.testDatabaseConnection = testDatabaseConnection;
exports.disconnectDatabase = disconnectDatabase;
const prisma_1 = require("../generated/prisma");
exports.prisma = globalThis.__prisma ??
    new prisma_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = exports.prisma;
}
async function testDatabaseConnection() {
    try {
        await exports.prisma.$connect();
        console.log('✅ Database connection successful');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}
async function disconnectDatabase() {
    await exports.prisma.$disconnect();
    console.log('📦 Database connection closed');
}
exports.userService = {
    async createUser(data) {
        try {
            if (!data.email?.trim()) {
                throw new Error('Email is required');
            }
            if (!data.password?.trim()) {
                throw new Error('Password is required');
            }
            return await exports.prisma.user.create({
                data: {
                    email: data.email.toLowerCase().trim(),
                    password: data.password,
                    role: data.role || prisma_1.UserRole.CLIENT,
                },
            });
        }
        catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'P2002') {
                throw new Error('User with this email already exists');
            }
            throw error;
        }
    },
    async findUserByEmail(email) {
        if (!email?.trim()) {
            return null;
        }
        return await exports.prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });
    },
    async findUserById(id) {
        if (!id?.trim()) {
            return null;
        }
        return await exports.prisma.user.findUnique({
            where: { id },
        });
    },
    async updateUserRole(id, role) {
        if (!id?.trim()) {
            throw new Error('User ID is required');
        }
        try {
            return await exports.prisma.user.update({
                where: { id },
                data: { role },
            });
        }
        catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                throw new Error('User not found');
            }
            throw error;
        }
    },
    async updateUserProfile(id, data) {
        if (!id?.trim()) {
            throw new Error('User ID is required');
        }
        const sanitizedData = {};
        if (data.name !== undefined) {
            sanitizedData.name = data.name?.trim() || undefined;
        }
        if (data.bio !== undefined) {
            sanitizedData.bio = data.bio?.trim() || undefined;
        }
        try {
            return await exports.prisma.user.update({
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
        }
        catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                throw new Error('User not found');
            }
            throw error;
        }
    },
    async getUserProfile(id) {
        if (!id?.trim()) {
            return null;
        }
        return await exports.prisma.user.findUnique({
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
    async createWork(data) {
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
        const sanitizedTags = Array.isArray(data.tags)
            ? data.tags.filter(tag => typeof tag === 'string' && tag.trim()).map(tag => tag.trim())
            : [];
        try {
            return await exports.prisma.work.create({
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
        }
        catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'P2003') {
                throw new Error('Creator not found');
            }
            throw error;
        }
    },
    async getWorksByCreator(creatorId) {
        if (!creatorId?.trim()) {
            return [];
        }
        return await exports.prisma.work.findMany({
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
    async getWorkById(id) {
        if (!id?.trim()) {
            return null;
        }
        return await exports.prisma.work.findUnique({
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
//# sourceMappingURL=database.js.map