import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import os from 'os';

// Image Processing
export async function processImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .resize(1920, null, { // Max width 1920, maintain aspect ratio
            withoutEnlargement: true,
            fit: 'inside'
        })
        .webp({ quality: 80 })
        .toBuffer();
}

// Video Processing
export async function processVideo(inputPath: string): Promise<string> {
    const outputPath = path.join(os.tmpdir(), `processed-${path.basename(inputPath)}.mp4`);

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                '-c:v libx264',     // Video codec
                '-crf 23',          // Quality (Lower is better)
                '-preset fast',     // Compression speed
                '-c:a aac',         // Audio codec
                '-b:a 128k',        // Audio bitrate
                '-movflags +faststart', // Web optimized (start playing before download finishes)
                '-vf scale=1280:-2', // Resize to 720p width
                '-pix_fmt yuv420p'   // Ensure compatibility with all browsers (Chrome/Safari/Edge)
            ])
            .on('end', () => {
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('FFmpeg error:', err);
                reject(err);
            })
            .save(outputPath);
    });
}
