import { NextRequest, NextResponse } from 'next/server';
import { getAllProductsFromDB, ProductService } from './product.service';
import { ProductValidation } from './product.validation';
import AppError from '@/app/lib/utils/AppError';
import { deleteFromCloudinary, uploadToCloudinary } from '@/app/lib/cloudinary';
import sendResponse from '@/app/lib/sendResponse';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

// --- Create Product (POST) ---
export const createProductController = async (req: AuthenticatedRequest) => {
  const formData = await req.formData();
  
  const imageFile = formData.get('image') as File | null;
  
  const productDataFromForm: any = {};
  for (const [key, value] of formData.entries()) {
      if (key !== 'image') {
          productDataFromForm[key] = value;
      }
  }

  if (!imageFile || imageFile.size === 0) {
      throw new AppError(400, 'Product image is required');
  }
  
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
  const cloudinaryResult = await uploadToCloudinary(imageBuffer);
  
  const validationResult = ProductValidation.productFormSchema.safeParse(productDataFromForm);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  
  const finalProductData = {
    ...validationResult.data,
    imageUrl: cloudinaryResult.secure_url,
    imagePublicId: cloudinaryResult.public_id,
  };

  const newProduct = await ProductService.createProductInDB(finalProductData);
  return sendResponse(201, 'Product created successfully', newProduct);
};

// --- Get All Products (GET) ---
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

// --- Get Single Product (GET) ---
// ✅ FIX: Type is now standard object { params: { id: string } }
export const getSingleProductController = async (
  req: NextRequest, 
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const product = await ProductService.getSingleProductFromDB(id);
  if (!product) { throw new AppError(404, 'Product not found or not active'); }
  return sendResponse( 200, 'Product retrieved successfully', product );
};

// --- Update Product (PUT) ---
// ✅ FIX: Type is now standard object { params: { id: string } }
export const updateProductController = async (
  req: AuthenticatedRequest, 
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  
  const formData = await req.formData();
  const imageFile = formData.get('image') as File | null;
  
  const productDataFromForm: any = {};
  for (const [key, value] of formData.entries()) {
    if (key !== 'image') {
      productDataFromForm[key] = value;
    }
  }

  const validationResult = ProductValidation.updateProductFormSchema.safeParse(productDataFromForm);
  if (!validationResult.success) throw validationResult.error;

  let updatePayload: any = { ...validationResult.data };

  if (imageFile && imageFile.size > 0) {
    const existingProduct = await ProductService.getAdminProductByIdFromDB(id);
    if (!existingProduct) throw new AppError(404, "Product not found to update");

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const cloudinaryResult = await uploadToCloudinary(imageBuffer);

    updatePayload.imageUrl = cloudinaryResult.secure_url;
    updatePayload.imagePublicId = cloudinaryResult.public_id;

    if (existingProduct.imagePublicId) {
       await deleteFromCloudinary(existingProduct.imagePublicId);
    }
  }

  const updatedProduct = await ProductService.updateProductInDB(id, updatePayload);
  return sendResponse( 200, 'Product updated successfully', updatedProduct );
};

// --- Delete Product (DELETE) ---
// ✅ FIX: Type is now standard object { params: { id: string } }
export const deleteProductController = async (
  req: AuthenticatedRequest, 
  { params }: { params: { id: string } }
) => {
    const { id } = params;
    await ProductService.deleteProductFromDB(id);
    return sendResponse( 200, 'Product deleted successfully', null );
};

// --- Get Admin Single Product ---
// ✅ FIX: Type is now standard object { params: { id: string } }
export const getAdminSingleProductController = async (
  req: AuthenticatedRequest, 
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const product = await ProductService.getAdminProductByIdFromDB(id); 
  if (!product) {
    throw new AppError(404, 'Product not found');
  }
  return sendResponse(200, 'Admin: Product retrieved successfully', product);
};