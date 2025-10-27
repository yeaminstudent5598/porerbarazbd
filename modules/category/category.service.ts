// modules/category/category.service.ts
import config from '@/app/lib/config';
import { v2 as cloudinary } from 'cloudinary';
import Category from './category.model';
import { ICategory } from './category.interface';
import AppError from '@/app/lib/utils/AppError';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  secure: true,
});

type TCreateCategoryData = {
  name: string;
  slug?: string;
  imageUrl: string;
  imagePublicId: string;
};

type TUpdateCategoryData = Partial<TCreateCategoryData>;

/**
 * Create a new category (Admin)
 */
const createCategoryInDB = async (categoryData: TCreateCategoryData): Promise<ICategory> => {
  const newCategory = await Category.create(categoryData);
  return newCategory.toJSON() as unknown as ICategory; // Type-safe cast
};

/**
 * Get all categories
 */
const getAllCategoriesFromDB = async (): Promise<ICategory[]> => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  return categories as unknown as ICategory[]; // Type-safe cast
};

/**
 * Get single category by ID or slug
 */
const getCategoryByIdOrSlugFromDB = async (identifier: string): Promise<ICategory | null> => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };
  const category = await Category.findOne(query).lean();
  return category as unknown as ICategory | null; // Type-safe cast
};

/**
 * Update a category (Admin)
 */
const updateCategoryInDB = async (categoryId: string, updateData: TUpdateCategoryData): Promise<ICategory> => {
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedCategory) throw new AppError(404, 'Category not found, update failed.');
  return updatedCategory as unknown as ICategory; // Type-safe cast
};

/**
 * Delete a category (Admin)
 */
const deleteCategoryFromDB = async (categoryId: string): Promise<ICategory> => {
  const categoryToDelete = await Category.findById(categoryId);
  if (!categoryToDelete) throw new AppError(404, 'Category not found, delete failed.');

  const publicId = categoryToDelete.imagePublicId;

  // Delete DB entry
  await categoryToDelete.deleteOne();

  // Delete image from Cloudinary
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Cloudinary delete error (DB entry deleted anyway):', err);
    }
  }

  return categoryToDelete.toJSON() as unknown as ICategory; // Type-safe cast
};

export const CategoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getCategoryByIdOrSlugFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
