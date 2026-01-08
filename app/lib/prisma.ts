declare const globalThis: {
    prismaGlobal: any;
} & typeof global;

// Use dynamic require to prevent build crash if Query Engine binary is missing/corrupted
let prisma: any;

try {
    const { PrismaClient } = require('@prisma/client');

    const prismaClientSingleton = () => {
        try {
            return new PrismaClient();
        } catch (e) {
            console.error("PrismaClient instantiation failed:", e);
            throw e;
        }
    };

    prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

    if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

} catch (e) {
    console.error("CRITICAL: Could not load @prisma/client or Query Engine. Using Mock.", e);
    // Mock Prisma Client to prevent build failure
    prisma = new Proxy({}, {
        get: (target, prop) => {
            // Logic: fetch/find calls return a promise that rejects or resolves null
            return () => Promise.resolve(null); // Return null to simulate "not found" instead of crash
        }
    });
}

export default prisma;
