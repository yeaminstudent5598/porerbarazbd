
import config from '@/app/lib/config';
import { v2 as cloudinary } from 'cloudinary';
import Category from './category.model';
import AppError from '@/app/lib/utils/AppError';
import { ICategory } from './category.interface';

// Cloudinary কনফিগার করুন
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name, // <-- এখন এটি কাজ করবে
  api_key: config.cloudinary_api_key,       // <-- এখন এটি কাজ করবে
  api_secret: config.cloudinary_api_secret, // <-- এখন এটি কাজ করবে
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


const getAllCategoriesFromDB = async (): Promise<ICategory[]> => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  return categories as ICategory[];
};


const getCategoryByIdOrSlugFromDB = async (
  identifier: string
): Promise<ICategory | null> => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };
    
  const category = await Category.findOne(query).lean();
  return category as ICategory | null;
};


const updateCategoryInDB = async (
  categoryId: string,
  updateData: TUpdateCategoryData
): Promise<ICategory | null> => {

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean(); // .lean() ব্যবহার করা হয়েছে
  
  if (!updatedCategory) {
     throw new AppError(404, 'Category not found, update failed.');
  }
  return updatedCategory as ICategory | null;
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
    
    // DB থেকে ডিলিট
    await categoryToDelete.deleteOne(); // or await Product.findByIdAndDelete(categoryId);
    
    // Cloudinary থেকে ছবি ডিলিট
    if (publicId) {
        try {
            console.log(`Deleting image from Cloudinary: ${publicId}`);
            await cloudinary.uploader.destroy(publicId);
        } catch (err) {
            console.error("Cloudinary delete error (DB entry deleted anyway):", err);
        }
    }
    
    // .toJSON() কল করে প্লেইন অবজেক্ট রিটার্ন
    return categoryToDelete.toJSON() as ICategory;
};

export const CategoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getCategoryByIdOrSlugFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};