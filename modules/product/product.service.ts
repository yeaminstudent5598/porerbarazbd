// modules/product/product.service.ts
import { IProduct } from './product.interface';
import Product from './product.model';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  secure: true,
});

// --- টাইপ ডিফিনিশন ---
// IProduct এখন প্লেইন অবজেক্ট, তাই Omit সঠিকভাবে কাজ করবে
type TCreateProductData = Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>; 
type TUpdateProductData = Partial<TCreateProductData>; 

type TProductQuery = {
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: string;
  limit?: string;
  searchTerm?: string;
}

const createProductInDB = async (
  productData: TCreateProductData
): Promise<IProduct> => {
  const newProduct = await Product.create(productData);
  return newProduct.toJSON() as IProduct;
};


const getAllProductsFromDB = async (
  query: TProductQuery
): Promise<{ data: IProduct[]; total: number; page: number; limit: number }> => {
  
  const filter: any = {};
  
  if (query.searchTerm) {
    filter.$or = [
      { name: { $regex: query.searchTerm, $options: 'i' } },
      { description: { $regex: query.searchTerm, $options: 'i' } }
    ];
  }
  
  if (query.category) {
    filter.category = query.category;
  }
  
  filter.status = query.status || 'Active'; // Public default

  const sort: any = {};
  if (query.sortBy) {
    sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean(); // .lean() প্লেইন অবজেক্ট রিটার্ন করে
    
  const total = await Product.countDocuments(filter);

  return {
    data: products as IProduct[], // <-- এখন এটি সঠিক
    total,
    page,
    limit,
  };
};

const getAllAdminProductsFromDB = async (
  query: TProductQuery
): Promise<{ data: IProduct[]; total: number; page: number; limit: number }> => {
    const filter: any = {};
    if (query.searchTerm) {
        filter.$or = [
          { name: { $regex: query.searchTerm, $options: 'i' } },
          { category: { $regex: query.searchTerm, $options: 'i' } },
        ];
    }
    if (query.status) { filter.status = query.status; }
    if (query.category) { filter.category = query.category; }

    const sort: any = query.sortBy ? { [query.sortBy]: query.sortOrder === 'desc' ? -1 : 1 } : { createdAt: -1 };
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find(filter).sort(sort).skip(skip).limit(limit).lean();
    const total = await Product.countDocuments(filter);

    return { data: products as IProduct[], total, page, limit };
};


const getSingleProductFromDB = async (
  productId: string
): Promise<IProduct | null> => {
  const product = await Product.findOne({ _id: productId, status: 'Active' }).lean();
  if (!product) {
    return null;
  }
  return product as IProduct; // <-- এখন এটি সঠিক
};

const getAdminProductByIdFromDB = async (
  productId: string
): Promise<IProduct | null> => {
  const product = await Product.findById(productId).lean(); 
  return product as IProduct | null; // <-- এখন এটি সঠিক
};

const updateProductInDB = async (
  productId: string,
  updateData: TUpdateProductData
): Promise<IProduct | null> => {
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
  
  if (!updatedProduct) {
     throw new AppError(404, 'Product not found, update failed.');
  }
  
  return updatedProduct as IProduct; // <-- এখন এটি সঠিক
};

const deleteProductFromDB = async (
  productId: string
): Promise<IProduct | null> => {
    const productToDelete = await Product.findById(productId);
    if (!productToDelete) {
         throw new AppError(404, 'Product not found, delete failed.');
    }
    const publicId = productToDelete.imagePublicId;

    await productToDelete.deleteOne();
    
    if (publicId) {
        try {
            console.log(`Deleting image from Cloudinary: ${publicId}`);
            await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
            console.error('Cloudinary delete error:', cloudinaryError);
        }
    }
    
    return productToDelete.toJSON() as IProduct;
};

// --- সার্ভিস এক্সপোর্ট ---
export const ProductService = {
  createProductInDB,
  getAllProductsFromDB,
  getAllAdminProductsFromDB,
  getSingleProductFromDB,
  getAdminProductByIdFromDB,
  updateProductInDB,
  deleteProductFromDB,
};