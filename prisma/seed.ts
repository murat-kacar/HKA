import { PrismaClient } from '@prisma/client';
import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
    console.log('🌱 Seeding database (CLEAN SLATE)...');

    // 0. Clean up existing data (Optional: Remove if you want to keep data)
    // Deleting in reverse order of dependencies
    await prisma.pressNews.deleteMany();
    await prisma.academyNews.deleteMany();
    await prisma.eventGalleryImage.deleteMany();
    await prisma.event.deleteMany();
    await prisma.application.deleteMany();
    // Courses have many-to-many with Instructors, need to handle carefully or just delete courses first
    // In implicit m-n, deleting records is fine, Prisma handles the join table rows.
    await prisma.course.deleteMany();
    await prisma.instructor.deleteMany();

    console.log('🗑️  Cleared existing content data');

    // 1. Admin User
    const username = 'admin';
    const password = 'securePassword123!';
    const existingAdmin = await prisma.admin.findUnique({ where: { username } });

    if (!existingAdmin) {
        console.log(`Creating admin user: ${username}`);
        const passwordHash = await hashPassword(password);
        await prisma.admin.create({
            data: { username, passwordHash },
        });
        console.log('✅ Admin user created');
    } else {
        console.log('ℹ️  Admin user already exists');
    }

    // 2. Site Settings
    const existingSettings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!existingSettings) {
        console.log('Creating site settings...');
        await prisma.siteSettings.create({
            data: {
                id: 1,
                seoTitle: "Hakan Karsak Akademi",
                seoDescription: "Hakan Karsak Akademi Resmi Web Sitesi",
                heroTitle: "SAHNE SENİN.",
                heroSubtitle: "Hakan Karsak Akademi ile oyunculuk yeteneğinizi keşfedin.",
            },
        });
        console.log('✅ Site settings created');
    } else {
        console.log('ℹ️  Site settings already exist');
    }

    console.log('');
    console.log('🎉 Database is clean and ready for real data!');
    console.log('');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
