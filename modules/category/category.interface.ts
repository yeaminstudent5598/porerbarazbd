// modules/product/product.interface.ts
import { Model } from 'mongoose';

// Interface for Product properties (প্লেইন অবজেক্ট, Document নয়)
export interface IProduct {
  _id?: string; // Mongoose _id যোগ করবে
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  category: string; // TODO: পরে Category মডিউলের সাথে ref যুক্ত করা যেতে পারে
  imageUrl: string;
  imagePublicId?: string; // Cloudinary ডিলিটের জন্য (আগের কোড অনুযায়ী)
  status: 'Active' | 'Draft' | 'Out of Stock';
  rating?: number;
  reviewsCount?: number;
  weight?: string;
  ingredients?: string[];
  createdAt?: Date; // Mongoose timestamps যোগ করবে
  updatedAt?: Date; // Mongoose timestamps যোগ করবে
}

// Interface for Mongoose Model
// এটি IProduct Document টাইপ ব্যবহার করবে (Mongoose নিজে থেকে যোগ করবে)
export interface IProductModel extends Model<IProduct> {
  // কোনো স্ট্যাটিক মেথড থাকলে এখানে যোগ করুন
}