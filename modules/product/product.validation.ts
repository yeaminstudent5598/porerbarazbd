// modules/product/product.validation.ts
import { z } from 'zod';

const ProductStatusEnum = z.enum(['Active', 'Draft', 'Out of Stock']);

// FormData থেকে আসা ডেটা (ছবি বাদে) ভ্যালিডেট করার জন্য
const productFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  discount: z.string().optional().or(z.literal('')),
  // coerce.number() FormData থেকে আসা 'string' কে 'number'-এ কনভার্ট করবে
  price: z.coerce.number().positive('Price must be a positive number'),
  oldPrice: z.coerce
    .number()
    .positive('Old price must be positive')
    .optional()
    .or(z.literal('')) // Allow empty string
    .transform(val => (val === '' ? undefined : val)), // Empty string to undefined
    
  stock: z.coerce.number().int().nonnegative('Stock must be 0 or more'),
  category: z.string().min(1, 'Category is required'),
  status: ProductStatusEnum.optional().default('Active'),
  weight: z.string().optional(),
  
  // ingredients স্ট্রিং হিসেবে আসবে (e.g., "a,b,c"), আমরা এটিকে অ্যারেতে রূপান্তর করবো
  ingredients: z.string().optional()
    .transform(val => val ? val.split(',').map(item => item.trim()) : undefined),
    
  // imageUrl এখানে নেই, কারণ এটি আপলোডের পর যোগ হবে
});

// আপডেটের জন্য (সবকিছু অপশনাল)
const updateProductFormSchema = productFormSchema.partial();

export const ProductValidation = {
  productFormSchema,
  updateProductFormSchema,
};