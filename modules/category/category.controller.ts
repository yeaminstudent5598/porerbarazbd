// modules/category/category.controller.ts
import { NextRequest, NextResponse } from 'next/server';
import { CategoryValidation } from './category.validation';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import AppError from '@/app/lib/utils/AppError';
import { uploadToCloudinary } from '@/app/lib/cloudinary';
import sendResponse from '@/app/lib/sendResponse';

// POST /api/categories (Admin Only)
export const createCategoryController = async (req: AuthenticatedRequest) => {
  const formData = await req.formData();
  
  const imageFile = formData.get('image') as File | null;
  
  const categoryDataFromForm: any = {};
  for (const [key, value] of formData.entries()) {
      if (key !== 'image') {
          categoryDataFromForm[key] = value;
      }
  }

  // 1. Validate text data
  const validationResult = CategoryValidation.categoryFormSchema.safeParse(categoryDataFromForm);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  
  // 2. Validate and Upload Image
  if (!imageFile || imageFile.size === 0) {
      throw new AppError(400, 'Category image is required');
  }
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
  const cloudinaryResult = await uploadToCloudinary(imageBuffer);

  // 3. Combine data for service
  const finalCategoryData = {
    ...validationResult.data,
    imageUrl: cloudinaryResult.secure_url,
    imagePublicId: cloudinaryResult.public_id,
  };

  // 4. Call service
  const newCategory = await CategoryService.createCategoryInDB(finalCategoryData);
  
  return sendResponse(201, 'Category created successfully', newCategory);
};

// GET /api/categories (Public)
export const getAllCategoriesController = async (req: NextRequest) => {
  const categories = await CategoryService.getAllCategoriesFromDB();
  return sendResponse(200, 'Categories retrieved successfully', categories);
};

// GET /api/categories/[idOrSlug] (Public)
export const getSingleCategoryController = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id: idOrSlug } = params; // idOrSlug নামে রিনেম করা হলো
  const category = await CategoryService.getCategoryByIdOrSlugFromDB(idOrSlug);
  if (!category) {
    throw new AppError(404, 'Category not found');
  }
  return sendResponse(200, 'Category retrieved successfully', category);
};

// PUT /api/categories/[id] (Admin Only)
export const updateCategoryController = async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
   const { id } = params;
   // TODO: Handle FormData for image update if needed
   const body = await req.json(); // Assuming JSON body for non-image update
   
   const validationResult = CategoryValidation.updateCategoryFormSchema.safeParse(body);
   if (!validationResult.success) {
      throw validationResult.error;
   }
   
   const updatedCategory = await CategoryService.updateCategoryInDB(id, validationResult.data);
   return sendResponse(200, 'Category updated successfully', updatedCategory);
};

// DELETE /api/categories/[id] (Admin Only)
export const deleteCategoryController = async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    await CategoryService.deleteCategoryFromDB(id);
    return sendResponse(200, 'Category deleted successfully', null);
};