import { PrismaClient } from '../generated/prisma';
declare global {
    var __prisma: PrismaClient | undefined;
}
export declare const prisma: PrismaClient<import("../generated/prisma").Prisma.PrismaClientOptions, never, import("../generated/prisma/runtime/library").DefaultArgs>;
export declare function testDatabaseConnection(): Promise<boolean>;
export declare function disconnectDatabase(): Promise<void>;
//# sourceMappingURL=database.d.ts.map