// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import config from './config'; // lib/config.ts থেকে

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  secure: true,
});

/**
 * Uploads an image buffer to Cloudinary
 * @param buffer The image buffer
 * @returns Promise resolving to Cloudinary upload result (any type)
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = config.cloudinary_folder || 'porerbazarbd'
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