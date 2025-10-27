// lib/config.ts
import dotenv from 'dotenv';
import path from 'path';

// .env.local ফাইলটি লোড করার জন্য পাথ ঠিক করা হয়েছে
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// আবশ্যক ভেরিয়েবলগুলো চেক করা
if (!process.env.MONGO_URI) {
  throw new Error('FATAL ERROR: MONGO_URI is not defined in .env.local');
}
if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error('FATAL ERROR: JWT_ACCESS_SECRET is not defined in .env.local');
}
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('FATAL ERROR: CLOUDINARY_CLOUD_NAME is not defined in .env.local');
}
if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error('FATAL ERROR: CLOUDINARY_API_KEY is not defined in .env.local');
}
if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error('FATAL ERROR: CLOUDINARY_API_SECRET is not defined in .env.local');
}


const config = {
  env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  port: process.env.PORT || 3000,
  mongo_uri: process.env.MONGO_URI,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET, // ! চিহ্ন বাদ দেওয়া ভালো, কারণ আমরা উপরে চেক করেছি
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
  },
  bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  
  // === Cloudinary ভেরিয়েবল যোগ করা হয়েছে ===
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  cloudinary_folder: process.env.CLOUDINARY_FOLDER || 'porerbazarbd',
  // ======================================
};

export default config;