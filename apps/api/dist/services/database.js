"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
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
//# sourceMappingURL=database.js.map