// modules/category/category.service.ts
import config from '@/app/lib/config';
import { ICategory } from './category.interface';
import { v2 as cloudinary } from 'cloudinary';
import Category from './category.model';
import AppError from '@/app/lib/utils/AppError';

// Cloudinary কনফিগার করুন
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  secure: true,
});

// --- টাইপ ডিফিনিশন ---
type TCreateCategoryData = {
  name: string;
  slug?: string;
  imageUrl: string;
  imagePublicId: string;
}
type TUpdateCategoryData = Partial<TCreateCategoryData>;

/**
 * (অ্যাডমিন) নতুন ক্যাটাগরি তৈরি করে
 */
const createCategoryInDB = async (
  categoryData: TCreateCategoryData
): Promise<ICategory> => {
  const newCategory = await Category.create(categoryData);
  return newCategory.toJSON() as ICategory;
};

/**
 * (পাবলিক) সব ক্যাটাগরি খোঁজে
 */
const getAllCategoriesFromDB = async (): Promise<ICategory[]> => {
  // .lean() প্লেইন অবজেক্ট রিটার্ন করে
  const categories = await Category.find().sort({ name: 1 }).lean<ICategory[]>(); // <-- Explicit Generic
  
  // ICategory এখন প্লেইন অবজেক্ট, তাই টাইপ কাস্ট সঠিক
  return categories;
};

/**
 * (পাবলিক) একটি ক্যাটাগরি ID বা Slug দিয়ে খোঁজে
 */
const getCategoryByIdOrSlugFromDB = async (
  identifier: string
): Promise<ICategory | null> => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };
    
  const category = await Category.findOne(query).lean<ICategory>(); // <-- Explicit Generic
  return category;
};

/**
 * (অ্যাডমিন) ক্যাটাগরি আপডেট করে
 */
const updateCategoryInDB = async (
  categoryId: string,
  updateData: TUpdateCategoryData
): Promise<ICategory | null> => {
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean<ICategory>(); // <-- Explicit Generic
  
  if (!updatedCategory) {
     throw new AppError(404, 'Category not found, update failed.');
  }
  return updatedCategory;
};

/**
 * (অ্যাডমিন) ক্যাটাগরি ডিলিট করে
 */
const deleteCategoryFromDB = async (
  categoryId: string
): Promise<ICategory | null> => {
    const categoryToDelete = await Category.findById(categoryId);
    
    if (!categoryToDelete) {
         throw new AppError(404, 'Category not found, delete failed.');
    }

    const publicId = categoryToDelete.imagePublicId;
    
    await categoryToDelete.deleteOne();
    
    if (publicId) {
        try {
            console.log(`Deleting image from Cloudinary: ${publicId}`);
            await cloudinary.uploader.destroy(publicId);
        } catch (err) {
            console.error("Cloudinary delete error (DB entry deleted anyway):", err);
        }
    }
    
    return categoryToDelete.toJSON() as ICategory;
};

export const CategoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getCategoryByIdOrSlugFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};