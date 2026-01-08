'use server';

import { processImage, processVideo } from '@/app/lib/media';
import { uploadToR2 } from '@/app/lib/storage';
import { writeFile, unlink, readFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';
import { randomUUID } from 'crypto';

export async function uploadFileAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) return { error: 'No file provided' };

    // Basic Validation
    if (file.size === 0) {
        return { error: 'Empty file' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
        // IMAGE HANDLING
        if (file.type.startsWith('image/')) {
            const processedBuffer = await processImage(buffer);
            const url = await uploadToR2({
                file: processedBuffer,
                fileName: file.name.replace(/\.[^/.]+$/, "") + ".webp",
                contentType: 'image/webp',
                folder: 'images'
            });
            return { url };
        }
        // VIDEO HANDLING
        else if (file.type.startsWith('video/')) {
            // Videos must be saved to disk for ffmpeg
            const tempInputPath = join(os.tmpdir(), `${randomUUID()}-${file.name}`);
            await writeFile(tempInputPath, buffer);

            try {
                const processedOutputPath = await processVideo(tempInputPath);

                // Debug Log
                const stats = await import('fs').then(fs => fs.promises.stat(processedOutputPath));
                console.log(`Processed Video Size: ${stats.size} bytes`);

                const processedFileBuffer = await readFile(processedOutputPath);

                const url = await uploadToR2({
                    file: processedFileBuffer,
                    fileName: file.name.replace(/\.[^/.]+$/, "") + ".mp4",
                    contentType: 'video/mp4',
                    folder: 'videos'
                });

                await unlink(processedOutputPath);
                return { url };
            } finally {
                await unlink(tempInputPath).catch((e) => console.error("Temp cleanup failed", e));
            }
        } else {
            return { error: 'Unsupported file type. Please upload Image or Video.' };
        }

    } catch (error: any) {
        console.error('Upload processing error:', error);
        console.error('Error Details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return { error: `Upload failed: ${error.message || 'Unknown error'}` };
    }
}
