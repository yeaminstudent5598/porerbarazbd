// modules/category/category.interface.ts
import { Model } from 'mongoose';

// Interface for Category properties (প্লেইন অবজেক্ট, Document নয়)
export interface ICategory {
  _id?: string; // Mongoose _id যোগ করবে
  name: string;
  slug: string; // URL-friendly name
  imageUrl: string; // Cloudinary URL
  imagePublicId: string; // Cloudinary public_id (ডিলিট করার জন্য)
  createdAt?: Date; // Mongoose timestamps যোগ করবে
  updatedAt?: Date; // Mongoose timestamps যোগ করবে
}

// Interface for Mongoose Model
// এটি ICategory Document টাইপ ব্যবহার করবে (Mongoose নিজে থেকে যোগ করবে)
export interface ICategoryModel extends Model<ICategory> {
  // কোনো স্ট্যাটিক মেথড থাকলে এখানে যোগ করুন
}