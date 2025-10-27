// modules/product/product.controller.ts
import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from './product.service';
import { ProductValidation } from './product.validation';
import { uploadToCloudinary } from '@/app/lib/cloudinary';
import AppError from '@/app/lib/utils/AppError';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import sendResponse from '@/app/lib/sendResponse';



// Controller for POST /api/products (Admin Only)
// (এই লজিকটি app/api/products/route.ts-এর ভেতরে থাকবে)
export const createProductController = async (req: AuthenticatedRequest) => {
  
  // ১. FormData পার্স করুন (JSON নয়)
  const formData = await req.formData();
  
  const imageFile = formData.get('image') as File;
  
  // FormData থেকে টেক্সট ডেটা বের করে অবজেক্ট তৈরি করুন
  const productDataFromForm: any = {};
  for (const [key, value] of formData.entries()) {
      if (key !== 'image') {
          productDataFromForm[key] = value;
      }
  }

  // ২. ছবি আপলোড (যদি থাকে)
  if (!imageFile || imageFile.size === 0) {
      throw new AppError(400, 'Product image is required');
  }
  
  // ফাইলকে বাফারে কনভার্ট করুন
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
  
  // Cloudinary-তে আপলোড করুন
  const cloudinaryResult = await uploadToCloudinary(imageBuffer);
  
  // ৩. টেক্সট ডেটা ভ্যালিডেট করুন (Zod coerce ব্যবহার করবে)
  const validationResult = ProductValidation.productFormSchema.safeParse(productDataFromForm);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  
  // ৪. সার্ভিসকে কল করার জন্য চূড়ান্ত ডেটা অবজেক্ট তৈরি করুন
  const finalProductData = {
    ...validationResult.data,
    imageUrl: cloudinaryResult.secure_url, // Cloudinary URL
    imagePublicId: cloudinaryResult.public_id, // Cloudinary Public ID
  };

  // ৫. সার্ভিস কল করুন
  const newProduct = await ProductService.createProductInDB(finalProductData);

  // ৬. রেসপন্স পাঠান
  return sendResponse(
    201, 
    'Product created successfully', 
    newProduct
  );
};

// --- অন্যান্য কন্ট্রোলার (GET, PUT, DELETE) ---

// GET /api/products (Public)
export const getAllProductsController = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());

  const result = await ProductService.getAllProductsFromDB(query);

  return sendResponse(
    200, 
    'Products retrieved successfully', 
    result.data, 
    { total: result.total, page: result.page, limit: result.limit }
  );
};

// GET /api/products/[id] (Public)
export const getSingleProductController = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const product = await ProductService.getSingleProductFromDB(id);

  if (!product) {
    throw new AppError(404, 'Product not found or not active');
  }

  return sendResponse(
    200, 
    'Product retrieved successfully', 
    product
  );
};

// PUT /api/products/[id] (Admin Only)
export const updateProductController = async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  
  // TODO: আপডেটের সময়ও FormData হ্যান্ডেল করতে হবে যদি ছবি পরিবর্তন করা যায়
  // আপাতত JSON আপডেট ধরে নিচ্ছি (ছবি বাদে)
  const body = await req.json(); 

  const validationResult = ProductValidation.updateProductFormSchema.safeParse(body);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  
  // TODO: যদি নতুন ছবি আপলোড করা হয়, তাহলে Cloudinary-তে আপলোড করতে হবে
  // এবং `validationResult.data`-তে নতুন `imageUrl` যোগ করতে হবে।
  
  const updatedProduct = await ProductService.updateProductInDB(id, validationResult.data);

  return sendResponse(
    200, 
    'Product updated successfully', 
    updatedProduct
  );
};

// DELETE /api/products/[id] (Admin Only)
export const deleteProductController = async (req: AuthenticatedRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    
    // সার্ভিস লেয়ার ডিলিট করবে (এবং Cloudinary থেকেও ডিলিট করতে পারে)
    await ProductService.deleteProductFromDB(id);

    return sendResponse(
        200, 
        'Product deleted successfully', 
        null
    );
};