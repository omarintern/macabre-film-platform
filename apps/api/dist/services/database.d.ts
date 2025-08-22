import { PrismaClient, UserRole } from '../generated/prisma';
declare global {
    var __prisma: PrismaClient | undefined;
}
export declare const prisma: PrismaClient<import("../generated/prisma").Prisma.PrismaClientOptions, never, import("../generated/prisma/runtime/library").DefaultArgs>;
export declare function testDatabaseConnection(): Promise<boolean>;
export declare function disconnectDatabase(): Promise<void>;
export declare const userService: {
    createUser(data: {
        email: string;
        password: string;
        role?: UserRole;
    }): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        role: import("../generated/prisma").$Enums.UserRole;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findUserByEmail(email: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        role: import("../generated/prisma").$Enums.UserRole;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findUserById(id: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        role: import("../generated/prisma").$Enums.UserRole;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateUserRole(id: string, role: UserRole): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        role: import("../generated/prisma").$Enums.UserRole;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserProfile(id: string, data: {
        name?: string;
        bio?: string;
    }): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import("../generated/prisma").$Enums.UserRole;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserProfile(id: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import("../generated/prisma").$Enums.UserRole;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createWork(data: {
        title: string;
        body: string;
        classification: string;
        tags: string[];
        creatorId: string;
    }): Promise<{
        creator: {
            name: string | null;
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        classification: string;
        tags: string[];
        creatorId: string;
    }>;
    getWorksByCreator(creatorId: string): Promise<({
        creator: {
            name: string | null;
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        classification: string;
        tags: string[];
        creatorId: string;
    })[]>;
    getWorkById(id: string): Promise<({
        creator: {
            name: string | null;
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        body: string;
        classification: string;
        tags: string[];
        creatorId: string;
    }) | null>;
};
//# sourceMappingURL=database.d.ts.map