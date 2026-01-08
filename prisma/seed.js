const { PrismaClient } = require('@prisma/client');
const { scrypt, randomBytes } = require('node:crypto');
const { promisify } = require('node:util');

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH));
    return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
    const username = 'admin';
    const password = 'securePassword123!';

    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
        where: { username },
    });

    if (!existingAdmin) {
        console.log(`Creating admin user: ${username}`);
        const passwordHash = await hashPassword(password);

        await prisma.admin.create({
            data: {
                username,
                passwordHash,
            },
        });
        console.log('Admin user created successfully.');
    } else {
        console.log('Admin user already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
