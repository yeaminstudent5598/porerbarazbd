// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import config from './config'; // lib/config.ts থেকে
import AppError from './utils/AppError'; // lib/utils/AppError.ts থেকে
import { Buffer } from 'buffer'; // Node.js বাফার

// Cloudinary কনফিগার করুন
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  secure: true,
});

/**
 * একটি বাফারকে Cloudinary-তে আপলোড করে
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = config.cloudinary_folder || 'porerbazarbd'
): Promise<any> => { // CloudinaryUploadResult টাইপ ব্যবহার করা যেতে পারে
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: folder,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(new AppError(500, 'Image upload failed'));
        }
        if (result) {
          return resolve(result);
        }
      }
    );

    stream.end(buffer); // বাফার সরাসরি stream.end()-এ পাস করুন
  });
};

/**
 * Cloudinary থেকে ছবি ডিলিট করে
 * @param publicId ছবির Public ID
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
    try {
        console.log(`Deleting image from Cloudinary: ${publicId}`);
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        // এখানে এরর থ্রো না করলেও চলবে, কারণ মূল ডেটা ডিলিট হওয়াই জরুরি
        // throw new AppError(500, 'Failed to delete old image');
    }
}