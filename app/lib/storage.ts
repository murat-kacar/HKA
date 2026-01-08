import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || 'mock-account-id';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || 'mock-key';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || 'mock-secret';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'mock-bucket';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-mock.r2.dev';

// R2 Client Config
const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

interface UploadParams {
    file: Buffer;
    fileName: string;
    contentType: string;
    folder?: string;
}

export async function uploadToR2({ file, fileName, contentType, folder = 'uploads' }: UploadParams): Promise<string> {
    const uniqueFileName = `${randomUUID()}-${fileName}`;
    const key = `${folder}/${uniqueFileName}`;

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: file,
            ContentType: contentType,
        });

        await s3Client.send(command);

        // Return the public URL
        return `${R2_PUBLIC_URL}/${key}`;
    } catch (error) {
        console.error('R2 Upload Error:', error);
        throw new Error('S3 Connection Failed'); // Throwing simpler error for test/client usage
    }
}
