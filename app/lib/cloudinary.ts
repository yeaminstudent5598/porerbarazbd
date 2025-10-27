// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// .env.local ফাইল থেকে ভেরিয়েবল লোড করার জন্য
// (Next.js নিজে থেকেই .env.local লোড করে)
const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

// Cloudinary আপলোড ফাংশন
/**
 * Uploads an image buffer to Cloudinary
 * @param buffer The image buffer
 * @returns Promise resolving to Cloudinary upload result
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = process.env.CLOUDINARY_FOLDER || 'porerbazarbd'
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: folder,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(error);
        }
        if (result) {
          return resolve(result);
        }
      }
    );

    // Write the buffer to the stream
    stream.write(buffer);
    stream.end();
  });
};