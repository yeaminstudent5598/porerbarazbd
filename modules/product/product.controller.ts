// modules/product/product.controller.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllProductsFromDB, ProductService } from './product.service';
import { ProductValidation } from './product.validation';
import AppError from '@/app/lib/utils/AppError';
import { uploadToCloudinary } from '@/app/lib/cloudinary';
import sendResponse from '@/app/lib/sendResponse';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

// Controller for POST /api/products (Admin Only)
export const createProductController = async (req: AuthenticatedRequest) => {
  
  // 1. FormData পার্স করুন
  const formData = await req.formData();
  
  const imageFile = formData.get('image') as File | null;
  
  const productDataFromForm: any = {};
  for (const [key, value] of formData.entries()) {
      if (key !== 'image') {
          productDataFromForm[key] = value;
      }
  }

  // 2. ছবি আপলোড (যদি থাকে)
  if (!imageFile || imageFile.size === 0) {
      throw new AppError(400, 'Product image is required');
  }
  
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
  const cloudinaryResult = await uploadToCloudinary(imageBuffer);
  
  // 3. টেক্সট ডেটা ভ্যালিডেট করুন
  const validationResult = ProductValidation.productFormSchema.safeParse(productDataFromForm);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  
  // 4. চূড়ান্ত ডেটা অবজেক্ট তৈরি করুন
  const finalProductData = {
    ...validationResult.data,
    imageUrl: cloudinaryResult.secure_url,
    imagePublicId: cloudinaryResult.public_id,
  };

  // 5. সার্ভিস কল করুন
  const newProduct = await ProductService.createProductInDB(finalProductData);
  
  return sendResponse(201, 'Product created successfully', newProduct);
};

// --- (getAllProductsController, getSingleProductController, ইত্যাদি অপরিবর্তিত) ---


export const getAllProductsController = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());
  const result = await getAllProductsFromDB(query);

  return sendResponse(200, "Products retrieved successfully", result.data, {
    total: result.total,
    page: result.page,
    limit: result.limit,
  });
};

export const getSingleProductController = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const product = await ProductService.getSingleProductFromDB(id);
  if (!product) { throw new AppError(404, 'Product not found or not active'); }
  return sendResponse( 200, 'Product retrieved successfully', product );
};

export const updateProductController = async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  // TODO: আপডেটের সময়ও FormData হ্যান্ডেল করতে হবে যদি ছবি পরিবর্তন করা যায়
  const body = await req.json(); 
  const validationResult = ProductValidation.updateProductFormSchema.safeParse(body);
  if (!validationResult.success) { throw validationResult.error; }
  const updatedProduct = await ProductService.updateProductInDB(id, validationResult.data);
  return sendResponse( 200, 'Product updated successfully', updatedProduct );
};

export const deleteProductController = async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    await ProductService.deleteProductFromDB(id);
    return sendResponse( 200, 'Product deleted successfully', null );
};

export const getAdminSingleProductController = async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const product = await ProductService.getAdminProductByIdFromDB(id); 
  if (!product) {
    throw new AppError(404, 'Product not found');
  }
  return sendResponse(200, 'Admin: Product retrieved successfully', product);
};