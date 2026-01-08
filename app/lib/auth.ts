import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

// Key definition
const KEY_LENGTH = 64;

/**
 * Hashes a password using Node.js native crypto (scrypt)
 * Format: salt:hexHash
 */
export async function hashPassword(password: string): Promise<string> {
    // 1. Generate a random salt
    const salt = randomBytes(16).toString('hex');

    // 2. Hash the password with the salt
    const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

    // 3. Return combined string
    return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a password against a stored hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    // 1. Split salt and hash
    const [salt, key] = storedHash.split(':');

    if (!salt || !key) return false;

    const keyBuffer = Buffer.from(key, 'hex');

    // 2. Hash the input password using the SAME salt
    const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

    // 3. Compare safely (timing attack safe)
    return timingSafeEqual(keyBuffer, derivedKey);
}
